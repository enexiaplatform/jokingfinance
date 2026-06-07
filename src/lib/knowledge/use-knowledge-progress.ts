"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  KNOWLEDGE_PROGRESS_EVENT,
  KNOWLEDGE_PROGRESS_STORAGE_KEY,
  type KnowledgeProgressRow,
  type KnowledgeProgressSnapshot,
} from "./progress-storage";

const emptySnapshot = JSON.stringify({ completedModules: [] });

function readSnapshot() {
  if (typeof window === "undefined") {
    return emptySnapshot;
  }

  return localStorage.getItem(KNOWLEDGE_PROGRESS_STORAGE_KEY) ?? emptySnapshot;
}

function parseSnapshot(snapshot: string): KnowledgeProgressSnapshot {
  try {
    const parsed = JSON.parse(snapshot) as Partial<KnowledgeProgressSnapshot>;

    return {
      completedModules: Array.isArray(parsed.completedModules) ? parsed.completedModules : [],
    };
  } catch {
    return { completedModules: [] };
  }
}

function writeSnapshot(progress: KnowledgeProgressSnapshot) {
  localStorage.setItem(KNOWLEDGE_PROGRESS_STORAGE_KEY, JSON.stringify(progress));
  window.dispatchEvent(new Event(KNOWLEDGE_PROGRESS_EVENT));
}

function mergeModules(...groups: string[][]) {
  return Array.from(new Set(groups.flat())).sort();
}

export function useKnowledgeProgress() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(KNOWLEDGE_PROGRESS_EVENT, onStoreChange);
      window.addEventListener("storage", onStoreChange);

      return () => {
        window.removeEventListener(KNOWLEDGE_PROGRESS_EVENT, onStoreChange);
        window.removeEventListener("storage", onStoreChange);
      };
    },
    readSnapshot,
    () => emptySnapshot,
  );
  const progress = useMemo(() => parseSnapshot(snapshot), [snapshot]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      return;
    }
    const supabaseClient = supabase;

    let active = true;

    async function syncFromSupabase() {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!active || !user) {
        return;
      }

      const { data, error } = await supabaseClient
        .from("user_knowledge_progress")
        .select("module_id")
        .eq("user_id", user.id);

      if (!active || error) {
        return;
      }

      const remoteModules = ((data ?? []) as KnowledgeProgressRow[]).map((row) => row.module_id);
      const localModules = parseSnapshot(readSnapshot()).completedModules;
      const completedModules = mergeModules(localModules, remoteModules);

      writeSnapshot({ completedModules });

      const missingRemoteModules = completedModules.filter(
        (moduleId) => !remoteModules.includes(moduleId),
      );

      if (missingRemoteModules.length > 0) {
        await supabaseClient.from("user_knowledge_progress").upsert(
          missingRemoteModules.map((moduleId) => ({
            user_id: user.id,
            module_id: moduleId,
          })),
          { onConflict: "user_id,module_id" },
        );
      }
    }

    void syncFromSupabase();

    return () => {
      active = false;
    };
  }, []);

  const setModuleCompleted = useCallback(
    async (moduleId: string, completed: boolean) => {
      const completedModules = completed
        ? mergeModules(progress.completedModules, [moduleId])
        : progress.completedModules.filter((item) => item !== moduleId);

      writeSnapshot({ completedModules });

      const supabase = createSupabaseBrowserClient();
      if (!supabase) {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      if (completed) {
        await supabase.from("user_knowledge_progress").upsert(
          {
            user_id: user.id,
            module_id: moduleId,
            completed_at: new Date().toISOString(),
          },
          { onConflict: "user_id,module_id" },
        );
        return;
      }

      await supabase
        .from("user_knowledge_progress")
        .delete()
        .eq("user_id", user.id)
        .eq("module_id", moduleId);
    },
    [progress.completedModules],
  );

  return {
    progress,
    setModuleCompleted,
  };
}
