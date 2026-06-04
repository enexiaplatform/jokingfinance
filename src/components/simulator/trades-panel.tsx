"use client";

import { formatDate, formatEmotion, formatPoints, formatTradeSide } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

export function TradesPanel() {
  const { state, loading } = useVirtualPortfolio();

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải giao dịch...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Lịch sử giao dịch</h1>
        <p className="mt-2 text-[#5b6861]">Tất cả lệnh mua/bán mô phỏng và luận điểm đi kèm.</p>
      </div>

      <section className="overflow-hidden rounded-md border border-[#e0e5dc] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full text-left text-sm">
            <thead className="bg-[#f3f7f0] text-xs uppercase text-[#66736c]">
              <tr>
                <th className="px-4 py-3">Ngày</th>
                <th className="px-4 py-3">Chiều</th>
                <th className="px-4 py-3">Mã</th>
                <th className="px-4 py-3">Số lượng</th>
                <th className="px-4 py-3">Giá</th>
                <th className="px-4 py-3">Phí</th>
                <th className="px-4 py-3">Sau phí</th>
                <th className="px-4 py-3">Cảm xúc</th>
                <th className="px-4 py-3">Luận điểm</th>
              </tr>
            </thead>
            <tbody>
              {state.trades.map((trade) => (
                <tr key={trade.id} className="border-t border-[#e0e5dc] align-top">
                  <td className="px-4 py-3">{formatDate(trade.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Badge tone={trade.side === "buy" ? "green" : "coral"}>
                      {formatTradeSide(trade.side)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-bold text-[#17201b]">{trade.ticker}</td>
                  <td className="px-4 py-3">{trade.quantity}</td>
                  <td className="px-4 py-3">{formatPoints(trade.price)}</td>
                  <td className="px-4 py-3">{formatPoints(trade.fee)}</td>
                  <td className="px-4 py-3">{formatPoints(trade.netValue)}</td>
                  <td className="px-4 py-3">{formatEmotion(trade.emotion)}</td>
                  <td className="px-4 py-3">{trade.thesis || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {state.trades.length === 0 ? (
            <p className="p-5 text-sm text-[#5b6861]">Chưa có giao dịch mô phỏng.</p>
          ) : null}
        </div>
      </section>

      <Disclaimer />
    </div>
  );
}
