"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, CloudOff, Database, Loader2, LogIn } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  SUPABASE_AUTH_CALLBACK_PATH,
  SUPABASE_PROJECT_URL,
  SUPABASE_REQUIRED_MIGRATIONS,
  SUPABASE_SYNC_TABLES,
} from "@/lib/supabase/setup";

type SyncStatus = "checking" | "local" | "signed-out" | "ready" | "schema-missing" | "error";

type SyncState = {
  status: SyncStatus;
  detail: string;
  missingTables: string[];
};

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) {
    return false;
  }

  return (
    error.code === "42P01" ||
    error.message?.includes("does not exist") ||
    error.message?.includes("Could not find the table")
  );
}

export function SupabaseSyncStatusCard() {
  const [syncState, setSyncState] = useState<SyncState>({
    status: "checking",
    detail: "Đang kiểm tra cấu hình đồng bộ.",
    missingTables: [],
  });

  useEffect(() => {
    let active = true;

    async function checkSyncStatus() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        if (active) {
          setSyncState({
            status: "local",
            detail: "Chưa có Supabase key. App đang lưu tiến độ trên trình duyệt này.",
            missingTables: [],
          });
        }
        return;
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (!active) {
        return;
      }

      if (authError) {
        setSyncState({
          status: "error",
          detail: authError.message,
          missingTables: [],
        });
        return;
      }

      if (!user) {
        setSyncState({
          status: "signed-out",
          detail: "Supabase đã cấu hình. Đăng nhập để bắt đầu đồng bộ dữ liệu người dùng.",
          missingTables: [],
        });
        return;
      }

      const checks = await Promise.all(
        SUPABASE_SYNC_TABLES.map(async (tableName) => {
          const { error } = await supabase.from(tableName).select("id").limit(1);

          return {
            tableName,
            error,
          };
        }),
      );

      if (!active) {
        return;
      }

      const missingTables = checks
        .filter((item) => isMissingTableError(item.error))
        .map((item) => item.tableName);
      const unexpectedError = checks.find((item) => item.error && !isMissingTableError(item.error));

      if (missingTables.length > 0) {
        setSyncState({
          status: "schema-missing",
          detail: "Supabase đã kết nối, nhưng database còn thiếu bảng cần cho đồng bộ.",
          missingTables,
        });
        return;
      }

      if (unexpectedError?.error) {
        setSyncState({
          status: "error",
          detail: unexpectedError.error.message,
          missingTables: [],
        });
        return;
      }

      setSyncState({
        status: "ready",
        detail: "Tài khoản đã đăng nhập và các bảng đồng bộ đã sẵn sàng.",
        missingTables: [],
      });
    }

    void checkSyncStatus();

    return () => {
      active = false;
    };
  }, []);

  const statusMeta = useMemo(() => {
    switch (syncState.status) {
      case "ready":
        return {
          icon: CheckCircle2,
          label: "Đã sẵn sàng đồng bộ",
          badge: "Online",
          className: "border-[#b9d9c5] bg-[#f2fbf4] text-[#0f766e]",
        };
      case "schema-missing":
        return {
          icon: AlertCircle,
          label: "Thiếu bảng Supabase",
          badge: "Cần migration",
          className: "border-[#e2d3a7] bg-[#fff8df] text-[#8a5a00]",
        };
      case "signed-out":
        return {
          icon: LogIn,
          label: "Chờ đăng nhập",
          badge: "Auth ready",
          className: "border-[#d0ded3] bg-white text-[#0f766e]",
        };
      case "error":
        return {
          icon: AlertCircle,
          label: "Cần kiểm tra lại",
          badge: "Lỗi",
          className: "border-[#efc1af] bg-[#fff3ef] text-[#9a3412]",
        };
      case "local":
        return {
          icon: CloudOff,
          label: "Đang lưu cục bộ",
          badge: "Local",
          className: "border-[#e2d3a7] bg-[#fff8df] text-[#8a5a00]",
        };
      default:
        return {
          icon: Loader2,
          label: "Đang kiểm tra",
          badge: "Checking",
          className: "border-[#d0ded3] bg-white text-[#0f766e]",
        };
    }
  }, [syncState.status]);
  const Icon = statusMeta.icon;

  return (
    <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className={`rounded-md border p-2 ${statusMeta.className}`}>
            <Icon
              className={`h-5 w-5 ${syncState.status === "checking" ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-[#0f766e]">
              Trạng thái Supabase
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#17201b]">{statusMeta.label}</h2>
            <p className="mt-2 text-sm leading-6 text-[#5b6861]">{syncState.detail}</p>
          </div>
        </div>
        <span className={`inline-flex w-fit rounded-md border px-3 py-1 text-xs font-bold ${statusMeta.className}`}>
          {statusMeta.badge}
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17201b]">
            <Database className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
            Danh mục ảo
          </div>
          <p className="mt-2 text-xs leading-5 text-[#66736c]">
            Tiền ảo, lệnh mua bán, nhật ký và nhiệm vụ.
          </p>
        </div>
        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17201b]">
            <Database className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
            Thư viện kiến thức
          </div>
          <p className="mt-2 text-xs leading-5 text-[#66736c]">
            Module đã học và tiến độ học tập theo tài khoản.
          </p>
        </div>
        <div className="rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#17201b]">
            <Database className="h-4 w-4 text-[#0f766e]" aria-hidden="true" />
            Chế độ fallback
          </div>
          <p className="mt-2 text-xs leading-5 text-[#66736c]">
            Nếu chưa có Supabase, app vẫn lưu tạm trên máy này.
          </p>
        </div>
      </div>

      {syncState.missingTables.length > 0 ? (
        <div className="mt-4 rounded-md border border-[#e2d3a7] bg-[#fff8df] p-3 text-sm leading-6 text-[#5b420b]">
          Cần chạy migration cho: <span className="font-bold">{syncState.missingTables.join(", ")}</span>
        </div>
      ) : null}

      <div className="mt-4 rounded-md border border-[#e0e5dc] bg-[#fffdf8] p-3 text-xs leading-5 text-[#66736c]">
        <p>
          Project đang chuẩn bị: <span className="font-bold text-[#17201b]">{SUPABASE_PROJECT_URL}</span>
        </p>
        <p className="mt-1">
          Callback cần có trong Supabase Auth:{" "}
          <span className="font-bold text-[#17201b]">{SUPABASE_AUTH_CALLBACK_PATH}</span>
        </p>
        <p className="mt-1">
          Migration cần chạy:{" "}
          <span className="font-bold text-[#17201b]">
            {SUPABASE_REQUIRED_MIGRATIONS.join(", ")}
          </span>
        </p>
      </div>
    </section>
  );
}
