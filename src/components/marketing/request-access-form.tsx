"use client";

import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const emptyForm = {
  name: "",
  email: "",
  ageRange: "",
  investingExperience: "beginner",
  mainGoal: "",
  willingnessToPay: "0",
  feedback: "",
};

export function RequestAccessForm({ interest = "early-access" }: { interest?: string }) {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isEbookInterest = interest === "ebook";

  function updateField(name: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();

    if (!supabase) {
      trackEvent("lead_form_error", {
        interest,
        error_code: "supabase_not_configured",
      });
      setMessage(
        "Form chưa được kết nối hệ thống nhận đăng ký. Vui lòng thử lại sau khi cấu hình Supabase.",
      );
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("early_access_requests").insert({
      name: form.name,
      email: form.email,
      age_range: isEbookInterest ? null : form.ageRange || null,
      investing_experience: isEbookInterest ? null : form.investingExperience,
      main_goal: form.mainGoal,
      willingness_to_pay: isEbookInterest ? null : form.willingnessToPay,
      feedback: `[interest:${interest}] ${form.feedback}`.trim(),
    });

    setLoading(false);

    if (error) {
      trackEvent("lead_form_error", {
        interest,
        error_code: error.code,
      });
      setMessage(error.message);
      return;
    }

    trackEvent(
      "lead_form_success",
      isEbookInterest
        ? { interest }
        : {
            interest,
            investing_experience: form.investingExperience,
            willingness_to_pay: form.willingnessToPay,
          },
    );
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-md border border-[#b9d9c5] bg-[#f2fbf4] p-6">
        <h2 className="text-2xl font-bold text-[#17201b]">
          {isEbookInterest ? "Bạn đã vào danh sách ebook." : "Cảm ơn bạn."}
        </h2>
        <p className="mt-3 leading-7 text-[#4c5d54]">
          {isEbookInterest
            ? "JokingFinance sẽ gửi cập nhật khi phần đọc thử tiếp theo hoặc bản ebook hoàn chỉnh sẵn sàng."
            : "JokingFinance đang trong giai đoạn bản thử nghiệm. Chúng tôi sẽ liên hệ khi bản thử nghiệm sẵn sàng."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-[#e0e5dc] bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-[#314039]">
          {isEbookInterest ? "Họ tên (không bắt buộc)" : "Họ tên"}
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            required={!isEbookInterest}
            className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
            placeholder="Tên của bạn"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-[#314039]">
          Địa chỉ thư điện tử
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            required
            className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
            placeholder="ban@example.com"
          />
        </label>
      </div>

      {!isEbookInterest ? (
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Nhóm tuổi
            <input
              value={form.ageRange}
              onChange={(event) => updateField("ageRange", event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
              placeholder="20-25"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Kinh nghiệm đầu tư
            <select
              value={form.investingExperience}
              onChange={(event) => updateField("investingExperience", event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
            >
              <option value="beginner">Mới bắt đầu</option>
              <option value="basic">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="experienced">Đã có kinh nghiệm</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Mức sẵn sàng trả
            <select
              value={form.willingnessToPay}
              onChange={(event) => updateField("willingnessToPay", event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
            >
              <option value="0">0</option>
              <option value="49k">49k</option>
              <option value="99k">99k</option>
              <option value="other">Khác</option>
            </select>
          </label>
        </div>
      ) : null}

      <label className="grid gap-2 text-sm font-semibold text-[#314039]">
        {isEbookInterest ? "Phần nào trong quy trình đầu tư làm bạn khó nhất?" : "Mục tiêu chính"}
        <textarea
          value={form.mainGoal}
          onChange={(event) => updateField("mainGoal", event.target.value)}
          rows={3}
          className="rounded-md border border-[#d9ddd3] px-3 py-2"
          placeholder={
            isEbookInterest
              ? "Ví dụ: chọn dữ kiện, định giá, quản trị tỷ trọng..."
              : "Bạn muốn học hoặc luyện điều gì?"
          }
        />
      </label>

      {!isEbookInterest ? (
        <label className="grid gap-2 text-sm font-semibold text-[#314039]">
          Góp ý
          <textarea
            value={form.feedback}
            onChange={(event) => updateField("feedback", event.target.value)}
            rows={4}
            className="rounded-md border border-[#d9ddd3] px-3 py-2"
            placeholder="Bạn muốn JokingFinance ưu tiên gì trong bản thử nghiệm?"
          />
        </label>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59] disabled:opacity-60"
      >
        {loading
          ? "Đang gửi..."
          : isEbookInterest
            ? "Nhận cập nhật ebook"
            : "Tham gia danh sách thử nghiệm"}
      </button>

      {message ? (
        <p className="rounded-md border border-[#efc1af] bg-[#fff3ef] p-3 text-sm text-[#9a3412]">
          {message}
        </p>
      ) : null}
    </form>
  );
}
