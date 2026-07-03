"use client";

import Link from "next/link";
import { BookOpen, CalendarClock, ClipboardList, NotebookPen } from "lucide-react";
import { sampleArticles } from "@/data/sample-content";
import { DISCIPLINE_REMINDERS } from "@/lib/constants";
import { formatPercent, formatPoints, formatTradeSide } from "@/lib/format";
import { getTradeReviewSchedule } from "@/lib/simulator/calculations";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Disclaimer } from "@/components/ui/disclaimer";
import { MetricCard } from "@/components/ui/metric-card";
import { KnowledgeDashboardCard } from "@/components/app/knowledge-dashboard-card";
import { PracticeCaseDashboardCard } from "@/components/app/practice-case-dashboard-card";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

export function DashboardPanel() {
  const { state, summary, loading, message } = useVirtualPortfolio();
  const latestArticle = sampleArticles[0];
  const activeProgress = state.missionProgress.find((item) => item.status === "in_progress");
  const activeMission =
    state.missions.find((mission) => mission.slug === activeProgress?.missionSlug) ??
    state.missions[0];
  const reminder = DISCIPLINE_REMINDERS[new Date().getDay() % DISCIPLINE_REMINDERS.length];
  const reviewSchedule = getTradeReviewSchedule(state);
  const dueReviews = reviewSchedule.filter((item) => item.status === "due");
  const nextReview = reviewSchedule.find((item) => item.status === "upcoming");

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải tổng quan...</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 rounded-md border border-[#d9ddd3] bg-[#fffdf8] p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <Badge tone={state.source === "supabase" ? "green" : "gold"}>
            {state.source === "supabase" ? "Đã đồng bộ Supabase" : "Chế độ dùng thử"}
          </Badge>
          <h1 className="mt-3 text-3xl font-bold text-[#17201b]">
            Xin chào{state.displayName ? `, ${state.displayName}` : ""}.
          </h1>
          <p className="mt-2 text-[#5b6861]">
            Hôm nay hãy đọc một bài ngắn, làm một nhiệm vụ nhỏ, rồi dùng mô phỏng để kiểm tra ý tưởng.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/articles">Đọc bài học</ButtonLink>
          <ButtonLink href="/app/simulator" variant="secondary">Mở mô phỏng</ButtonLink>
        </div>
      </div>

      {message ? (
        <p className="rounded-md border border-[#d9ddd3] bg-white p-3 text-sm text-[#4c5d54]">
          {message}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Tiền ảo còn lại" value={formatPoints(state.cash)} />
        <MetricCard label="Giá trị danh mục" value={formatPoints(summary.portfolioValue)} />
        <MetricCard
          label="Lãi/lỗ"
          value={formatPoints(summary.pnl)}
          tone={summary.pnl >= 0 ? "positive" : "danger"}
          helper={formatPercent(summary.pnlPercent)}
        />
        <MetricCard label="Mã đang giữ" value={summary.holdingsCount} helper="Số mã đang nắm giữ" />
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <KnowledgeDashboardCard />
        <PracticeCaseDashboardCard />
      </div>

      <section className="rounded-md border border-[#b8d8d1] bg-[#f1faf7] p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
              <h2 className="text-xl font-bold text-[#17201b]">Xem lại quyết định</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[#4c5d54]">
              {dueReviews.length > 0
                ? `${dueReviews.length} quyết định đã đến hạn. Hãy kiểm tra lại luận điểm trước khi nhìn vào lãi/lỗ.`
                : nextReview
                  ? `Chưa có việc quá hạn. Lần xem lại tiếp theo còn ${nextReview.daysUntil} ngày.`
                  : "Giao dịch mô phỏng đầu tiên sẽ tạo lịch xem lại sau 7, 14 hoặc 30 ngày."}
            </p>
          </div>
          <ButtonLink href="/app/journal" variant={dueReviews.length > 0 ? "primary" : "secondary"}>
            {dueReviews.length > 0 ? "Xem việc đến hạn" : "Mở nhật ký"}
          </ButtonLink>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#17201b]">Bài học hôm nay</h2>
          </div>
          <h3 className="mt-4 font-bold text-[#17201b]">{latestArticle.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#5b6861]">{latestArticle.summary}</p>
          <Link
            href={`/articles/${latestArticle.slug}`}
            className="mt-4 inline-flex text-sm font-semibold text-[#0f766e]"
          >
            Đọc bài học
          </Link>
        </section>

        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-[#d65a31]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#17201b]">Nhiệm vụ đang làm</h2>
          </div>
          <h3 className="mt-4 font-bold text-[#17201b]">{activeMission?.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#5b6861]">{activeMission?.description}</p>
          <Link href="/app/missions" className="mt-4 inline-flex text-sm font-semibold text-[#0f766e]">
            Xem nhiệm vụ
          </Link>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <NotebookPen className="h-5 w-5 text-[#0f766e]" aria-hidden="true" />
            <h2 className="text-xl font-bold text-[#17201b]">Giao dịch gần đây</h2>
          </div>
          <div className="mt-4 grid gap-3">
            {state.trades.slice(0, 5).map((trade) => (
              <div key={trade.id} className="flex items-center justify-between rounded-md border border-[#e0e5dc] p-3 text-sm">
                <span className="font-semibold text-[#17201b]">
                  {formatTradeSide(trade.side)} {trade.quantity} {trade.ticker}
                </span>
                <span className="text-[#66736c]">{formatPoints(trade.netValue)}</span>
              </div>
            ))}
            {state.trades.length === 0 ? (
              <p className="text-sm text-[#5b6861]">Chưa có giao dịch mô phỏng nào.</p>
            ) : null}
          </div>
        </section>

        <section className="rounded-md border border-[#e2d3a7] bg-[#fff8df] p-5">
          <h2 className="text-xl font-bold text-[#5b420b]">Nhắc nhở kỷ luật</h2>
          <p className="mt-3 text-lg font-semibold leading-8 text-[#5b420b]">{reminder}</p>
        </section>
      </div>

      <Disclaimer />
    </div>
  );
}
