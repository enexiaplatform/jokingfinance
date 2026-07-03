"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { trackEvent } from "@/lib/analytics";
import { SIMULATOR_SAFETY_CONSENT_KEY } from "@/lib/constants";

type SimulatorSafetyConsentProps = {
  children: React.ReactNode;
};

const SAFETY_CONSENT_EVENT = "jokingfinance-safety-consent-updated";

function subscribeToSafetyConsent(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(SAFETY_CONSENT_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SAFETY_CONSENT_EVENT, callback);
  };
}

function getSafetyConsentSnapshot() {
  return localStorage.getItem(SIMULATOR_SAFETY_CONSENT_KEY) === "accepted";
}

export function SimulatorSafetyConsent({
  children,
}: SimulatorSafetyConsentProps) {
  const accepted = useSyncExternalStore(
    subscribeToSafetyConsent,
    getSafetyConsentSnapshot,
    () => false,
  );
  const [checked, setChecked] = useState(false);

  if (accepted) {
    return children;
  }

  return (
    <section className="mx-auto max-w-2xl rounded-md border border-[#e2d3a7] bg-[#fff8df] p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <ShieldCheck className="mt-1 h-7 w-7 shrink-0 text-[#8a5a0a]" aria-hidden="true" />
        <div>
          <h1 className="text-2xl font-bold text-[#5b420b]">
            Xác nhận trước khi dùng mô phỏng
          </h1>
          <p className="mt-3 leading-7 text-[#6e5315]">
            JokingFinance dùng điểm ảo để luyện quyết định. Dữ liệu thị trường có thể
            trễ, thiếu hoặc chuyển sang dữ liệu minh họa khi nguồn lỗi. Không dùng thông
            tin tại đây để đặt lệnh tiền thật.
          </p>
          <label className="mt-5 flex items-start gap-3 rounded-md border border-[#e2d3a7] bg-white/70 p-3 text-sm leading-6 text-[#5b420b]">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => setChecked(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#0f766e]"
            />
            <span>
              Tôi hiểu đây không phải tư vấn đầu tư, điểm ảo không có giá trị và kết quả
              mô phỏng không đảm bảo kết quả thật.
            </span>
          </label>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              disabled={!checked}
              onClick={() => {
                localStorage.setItem(SIMULATOR_SAFETY_CONSENT_KEY, "accepted");
                trackEvent("risk_disclaimer_accepted", {
                  location: "simulator_first_use",
                });
                window.dispatchEvent(new Event(SAFETY_CONSENT_EVENT));
              }}
              className="min-h-11 rounded-md bg-[#0f766e] px-5 text-sm font-bold text-white hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Tiếp tục vào mô phỏng
            </button>
            <Link
              href="/risk-disclaimer"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#d1bd7a] bg-white px-5 text-sm font-bold text-[#5b420b]"
            >
              Đọc cảnh báo đầy đủ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
