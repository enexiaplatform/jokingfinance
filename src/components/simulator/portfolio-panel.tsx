"use client";

import { AlertTriangle } from "lucide-react";
import { formatPercent, formatPoints } from "@/lib/format";
import { Disclaimer } from "@/components/ui/disclaimer";
import { MetricCard } from "@/components/ui/metric-card";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

export function PortfolioPanel() {
  const { state, summary, loading } = useVirtualPortfolio();

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải danh mục...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Danh mục ảo</h1>
        <p className="mt-2 text-[#5b6861]">Theo dõi tiền ảo, mã đang giữ, lãi/lỗ và mức độ tập trung.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Điểm ảo ban đầu" value={formatPoints(state.startingCash)} />
        <MetricCard label="Tiền ảo còn lại" value={formatPoints(state.cash)} />
        <MetricCard label="Giá trị đang giữ" value={formatPoints(summary.holdingsValue)} />
        <MetricCard
          label="Tổng lãi/lỗ"
          value={formatPoints(summary.pnl)}
          tone={summary.pnl >= 0 ? "positive" : "danger"}
          helper={formatPercent(summary.pnlPercent)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Số mã đang giữ" value={summary.holdingsCount} />
        <MetricCard
          label="Mã lớn nhất"
          value={summary.topHolding?.ticker ?? "-"}
          helper={summary.topHolding ? formatPercent(summary.topHolding.weight) : "Chưa có"}
        />
        <MetricCard
          label="Mã lãi nhất"
          value={summary.topWinner?.ticker ?? "-"}
          helper={summary.topWinner ? formatPercent(summary.topWinner.pnlPercent) : "Chưa có"}
        />
        <MetricCard
          label="Mã lỗ nhất"
          value={summary.topLoser?.ticker ?? "-"}
          helper={summary.topLoser ? formatPercent(summary.topLoser.pnlPercent) : "Chưa có"}
        />
      </div>

      {summary.concentrationWarning ? (
        <div className="flex gap-3 rounded-md border border-[#e2d3a7] bg-[#fff8df] p-4 text-sm leading-6 text-[#5b420b]">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          {summary.concentrationWarning}
        </div>
      ) : null}

      <section className="overflow-hidden rounded-md border border-[#e0e5dc] bg-white shadow-sm">
        <div className="border-b border-[#e0e5dc] p-5">
          <h2 className="text-xl font-bold text-[#17201b]">Bảng mã đang giữ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-[#f3f7f0] text-xs uppercase text-[#66736c]">
              <tr>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Doanh nghiệp</th>
                <th className="px-4 py-3">Ngành</th>
                <th className="px-4 py-3">Số lượng</th>
                <th className="px-4 py-3">Giá vốn</th>
                <th className="px-4 py-3">Hiện tại</th>
                <th className="px-4 py-3">Giá trị</th>
                <th className="px-4 py-3">Lãi/lỗ</th>
                <th className="px-4 py-3">Tỷ trọng</th>
              </tr>
            </thead>
            <tbody>
              {summary.holdingRows.map((holding) => (
                <tr key={holding.ticker} className="border-t border-[#e0e5dc]">
                  <td className="px-4 py-3 font-bold text-[#17201b]">{holding.ticker}</td>
                  <td className="px-4 py-3">{holding.stock?.companyName ?? "-"}</td>
                  <td className="px-4 py-3">{holding.stock?.sector ?? "-"}</td>
                  <td className="px-4 py-3">{holding.quantity}</td>
                  <td className="px-4 py-3">{formatPoints(holding.averagePrice)}</td>
                  <td className="px-4 py-3">{formatPoints(holding.currentPrice)}</td>
                  <td className="px-4 py-3">{formatPoints(holding.marketValue)}</td>
                  <td className="px-4 py-3">
                    {formatPoints(holding.pnl)} · {formatPercent(holding.pnlPercent)}
                  </td>
                  <td className="px-4 py-3">{formatPercent(holding.weight)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {summary.holdingRows.length === 0 ? (
            <p className="p-5 text-sm text-[#5b6861]">Chưa có mã nào trong danh mục.</p>
          ) : null}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
