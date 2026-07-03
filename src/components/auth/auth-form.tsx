"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedSafety, setAcceptedSafety] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const isSignup = mode === "signup";
  const initialMessage = searchParams.get("message") ?? "";

  function getSafeRedirectTo() {
    const redirectTo = searchParams.get("redirectTo") ?? "/app/dashboard";

    if (!redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
      return "/app/dashboard";
    }

    return redirectTo;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createSupabaseBrowserClient();
    const redirectTo = getSafeRedirectTo();

    if (isSignup && !acceptedSafety) {
      setLoading(false);
      setMessage("Bạn cần xác nhận điều khoản và cảnh báo rủi ro trước khi tạo tài khoản.");
      return;
    }

    if (!supabase) {
      if (displayName) {
        localStorage.setItem("jokingfinance-display-name", displayName);
      }
      trackEvent(isSignup ? "signup_demo_success" : "login_demo_success", {
        redirect_to: redirectTo,
      });
      setMessage("Chế độ dùng thử: chưa cấu hình biến môi trường Supabase, đang mở khu vực app.");
      router.push(redirectTo);
      return;
    }

    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
            redirectTo,
          )}`,
        },
      });

      setLoading(false);

      if (error) {
        trackEvent("signup_error", {
          error_code: error.code,
        });
        setMessage(error.message);
        return;
      }

      if (data.session) {
        trackEvent("signup_success", {
          confirmation_required: false,
          redirect_to: redirectTo,
        });
        router.push(redirectTo);
        router.refresh();
        return;
      }

      trackEvent("signup_success", {
        confirmation_required: true,
        redirect_to: redirectTo,
      });
      setMessage("Tài khoản đã được tạo. Kiểm tra email nếu Supabase đang bật xác nhận email.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      trackEvent("login_error", {
        error_code: error.code,
      });
      setMessage(error.message);
      return;
    }

    trackEvent("login_success", {
      redirect_to: redirectTo,
    });
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {isSignup ? (
        <label className="grid gap-2 text-sm font-semibold text-[#314039]">
          Tên hiển thị
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-[#17201b]"
            placeholder="Tên hiển thị"
          />
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-semibold text-[#314039]">
        Địa chỉ thư điện tử
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-[#17201b]"
          placeholder="ban@example.com"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#314039]">
        Mật khẩu
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
          className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-[#17201b]"
          placeholder="Tối thiểu 6 ký tự"
        />
      </label>

      {isSignup ? (
        <label className="flex items-start gap-3 rounded-md border border-[#d9ddd3] bg-[#f8fbf7] p-3 text-sm leading-6 text-[#43534a]">
          <input
            type="checkbox"
            checked={acceptedSafety}
            onChange={(event) => {
              const checked = event.target.checked;
              setAcceptedSafety(checked);

              if (checked) {
                trackEvent("risk_disclaimer_accepted", {
                  location: "signup",
                });
              }
            }}
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[#0f766e]"
          />
          <span>
            Tôi đồng ý với{" "}
            <a href="/terms" className="font-semibold text-[#0f766e] underline">
              Điều khoản
            </a>{" "}
            và đã đọc{" "}
            <a
              href="/risk-disclaimer"
              className="font-semibold text-[#0f766e] underline"
            >
              Cảnh báo rủi ro & nguồn dữ liệu
            </a>
            . Tôi hiểu đây là công cụ giáo dục, dữ liệu có thể trễ và điểm ảo không có
            giá trị tiền thật.
          </span>
        </label>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#115e59] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Đang xử lý..." : isSignup ? "Tạo tài khoản" : "Đăng nhập"}
      </button>

      {message || initialMessage ? (
        <p className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-3 text-sm leading-6 text-[#5b420b]">
          {message || initialMessage}
        </p>
      ) : null}
    </form>
  );
}
