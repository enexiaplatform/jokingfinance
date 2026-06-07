"use client";

import { FormEvent, useState } from "react";
import { SupabaseSyncStatusCard } from "@/components/app/supabase-sync-status-card";
import { Disclaimer } from "@/components/ui/disclaimer";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

export function SettingsPanel() {
  const {
    state,
    loading,
    message,
    updateDisplayName,
    resetPortfolio,
  } = useVirtualPortfolio();
  const [draftDisplayName, setDraftDisplayName] = useState<string | null>(null);
  const displayName = draftDisplayName ?? state.displayName;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateDisplayName(displayName);
  }

  function handleReset() {
    const confirmed = window.confirm(
      "Đưa danh mục ảo về 100.000.000 điểm ảo và xóa các mã đang giữ? Lịch sử giao dịch cũ vẫn được giữ.",
    );

    if (confirmed) {
      resetPortfolio();
    }
  }

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải cài đặt...</div>;
  }

  return (
    <div className="grid max-w-3xl gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Cài đặt</h1>
        <p className="mt-2 text-[#5b6861]">Cấu hình tài khoản bản thử nghiệm và đặt lại danh mục ảo khi cần luyện lại.</p>
      </div>

      {message ? (
        <p className="rounded-md border border-[#d9ddd3] bg-white p-3 text-sm text-[#4c5d54]">
          {message}
        </p>
      ) : null}

      <SupabaseSyncStatusCard />

      <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-[#17201b]">Tên hiển thị</h2>
        <input
          value={displayName}
          onChange={(event) => setDraftDisplayName(event.target.value)}
          className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
          placeholder="Tên hiển thị"
        />
        <button
          type="submit"
          className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
        >
          Lưu cài đặt
        </button>
      </form>

      <section className="rounded-md border border-[#efc1af] bg-[#fff3ef] p-5">
        <h2 className="text-xl font-bold text-[#9a3412]">Đặt lại danh mục ảo</h2>
        <p className="mt-2 text-sm leading-6 text-[#7c3a20]">
          Thao tác này sẽ đưa tiền ảo về mức ban đầu và xóa các mã đang giữ. Lịch sử
          giao dịch cũ được giữ để bạn vẫn có thể xem lại.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 min-h-11 rounded-md border border-[#d65a31] bg-white px-4 text-sm font-semibold text-[#9a3412] hover:bg-[#fff8f5]"
        >
          Đặt lại danh mục ảo
        </button>
      </section>

      <Disclaimer />
    </div>
  );
}
