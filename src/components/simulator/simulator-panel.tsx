"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MOCK_DATA_DISCLAIMER } from "@/lib/constants";
import { estimateBuyCost, estimateSellProceeds } from "@/lib/simulator/calculations";
import type { ReviewInterval, TradeEmotion } from "@/lib/simulator/types";
import { formatEmotion, formatPercent, formatPoints, formatTradeSide } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { MetricCard } from "@/components/ui/metric-card";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

const emotions: TradeEmotion[] = ["calm", "curious", "FOMO", "confident", "uncertain"];

export function SimulatorPanel() {
  const searchParams = useSearchParams();
  const { state, summary, loading, message, buyStock, sellStock } = useVirtualPortfolio();
  
  const [side, setSide] = useState<"buy" | "sell">(() => {
    const s = searchParams.get("side");
    return s === "buy" || s === "sell" ? s : "buy";
  });
  const [ticker, setTicker] = useState(
    () => searchParams.get("ticker")?.trim().toUpperCase() || "FPT",
  );
  const [quantity, setQuantity] = useState(() => {
    const q = Number(searchParams.get("quantity"));
    return q > 0 ? q : 10;
  });
  const [thesis, setThesis] = useState(() => searchParams.get("thesis") || "");
  const [expectedHoldingPeriod, setExpectedHoldingPeriod] = useState("1-3 tháng");
  const [riskNote, setRiskNote] = useState(() => searchParams.get("riskNote") || "");
  const [emotion, setEmotion] = useState<TradeEmotion>("calm");
  const [reviewAfterDays, setReviewAfterDays] = useState<ReviewInterval>(7);

  // Sync state with query parameters during render if they change
  const currentParamsString = searchParams.toString();
  const [prevParamsString, setPrevParamsString] = useState(currentParamsString);

  if (currentParamsString !== prevParamsString) {
    setPrevParamsString(currentParamsString);
    
    const sideParam = searchParams.get("side");
    if (sideParam === "buy" || sideParam === "sell") {
      setSide(sideParam);
    }
    const tickerParam = searchParams.get("ticker");
    if (tickerParam) {
      setTicker(tickerParam.trim().toUpperCase());
    }
    const qtyParam = Number(searchParams.get("quantity"));
    if (qtyParam > 0) {
      setQuantity(qtyParam);
    }
    const thesisParam = searchParams.get("thesis");
    if (thesisParam) {
      setThesis(thesisParam);
    }
    const riskParam = searchParams.get("riskNote");
    if (riskParam) {
      setRiskNote(riskParam);
    }
  }

  const selectedStock = useMemo(
    () => state.stocks.find((stock) => stock.ticker === ticker) ?? state.stocks[0],
    [state.stocks, ticker],
  );
  const selectedHolding = state.holdings.find(
    (holding) => holding.ticker === selectedStock?.ticker,
  );
  const estimate = selectedStock
    ? side === "buy"
      ? estimateBuyCost(quantity, selectedStock.currentPrice)
      : estimateSellProceeds(quantity, selectedStock.currentPrice)
    : { gross: 0, fee: 0, net: 0 };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = {
      ticker: selectedStock?.ticker ?? ticker,
      quantity,
      thesis,
      expectedHoldingPeriod,
      riskNote,
      emotion,
      reviewAfterDays,
    };

    if (side === "buy") {
      buyStock(input);
    } else {
      sellStock(input);
    }
  }

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải mô phỏng...</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#17201b]">Mô phỏng danh mục ảo</h1>
          <p className="mt-2 max-w-3xl text-[#5b6861]">
            Mua/bán cổ phiếu mô phỏng bằng điểm ảo, ghi luận điểm và phần tự xem lại.
          </p>
        </div>
        <Badge tone="gold">Phí mô phỏng 0,15%</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Tiền ảo còn lại" value={formatPoints(state.cash)} />
        <MetricCard label="Giá trị danh mục" value={formatPoints(summary.portfolioValue)} />
        <MetricCard
          label="Lãi/lỗ"
          value={formatPoints(summary.pnl)}
          tone={summary.pnl >= 0 ? "positive" : "danger"}
          helper={formatPercent(summary.pnlPercent)}
        />
      </div>

      {message ? (
        <p className="rounded-md border border-[#d9ddd3] bg-white p-3 text-sm text-[#4c5d54]">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <div>
            <p className="text-sm font-semibold text-[#314039]">Chiều giao dịch</p>
            <div className="mt-2 grid grid-cols-2 rounded-md border border-[#d9ddd3] bg-[#f8fbf7] p-1">
              {(["buy", "sell"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSide(value)}
                  className={`min-h-10 rounded-md text-sm font-semibold ${
                    side === value
                      ? "bg-[#0f766e] text-white"
                      : "text-[#4c5d54] hover:bg-white"
                  }`}
                >
                  {formatTradeSide(value)}
                </button>
              ))}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Cổ phiếu
            <select
              value={selectedStock?.ticker ?? ticker}
              onChange={(event) => setTicker(event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
            >
              {state.stocks.map((stock) => (
                <option key={stock.ticker} value={stock.ticker}>
                  {stock.ticker} · {stock.companyName}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Số lượng
            <input
              type="number"
              min={1}
              step={1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
            />
          </label>

          <div className="rounded-md border border-[#d9ddd3] bg-[#f8fbf7] p-4 text-sm">
            <div className="grid gap-2">
              <div className="flex justify-between gap-3">
                <span>Giá hiện tại</span>
                <span className="font-mono font-semibold">
                  {formatPoints(selectedStock?.currentPrice ?? 0)}
                </span>
              </div>
              <div className="flex justify-between gap-3">
                <span>{side === "buy" ? "Chi phí ước tính" : "Tiền thu về ước tính"}</span>
                <span className="font-mono font-semibold">{formatPoints(estimate.gross)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span>Phí</span>
                <span className="font-mono font-semibold">{formatPoints(estimate.fee)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-[#d9ddd3] pt-2">
                <span>Giá trị sau phí</span>
                <span className="font-mono font-bold">{formatPoints(estimate.net)}</span>
              </div>
              {side === "sell" ? (
                <div className="flex justify-between gap-3 text-[#66736c]">
                  <span>Số lượng đang giữ</span>
                  <span className="font-mono font-semibold">{selectedHolding?.quantity ?? 0}</span>
                </div>
              ) : null}
            </div>
          </div>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Vì sao bạn muốn {side === "buy" ? "mua" : "bán"} mã này?
            <textarea
              value={thesis}
              onChange={(event) => setThesis(event.target.value)}
              required
              minLength={10}
              rows={3}
              className="rounded-md border border-[#d9ddd3] px-3 py-2"
              placeholder="Viết luận điểm ngắn trước khi xác nhận"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Thời gian dự kiến nắm giữ
            <input
              value={expectedHoldingPeriod}
              onChange={(event) => setExpectedHoldingPeriod(event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] px-3"
              placeholder="Ví dụ: 1-3 tháng"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Ghi chú rủi ro
            <textarea
              value={riskNote}
              onChange={(event) => setRiskNote(event.target.value)}
              required={side === "buy"}
              minLength={side === "buy" ? 5 : undefined}
              rows={2}
              className="rounded-md border border-[#d9ddd3] px-3 py-2"
              placeholder="Rủi ro nào có thể làm luận điểm sai?"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Cảm xúc
            <select
              value={emotion}
              onChange={(event) => setEmotion(event.target.value as TradeEmotion)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
            >
              {emotions.map((item) => (
                <option key={item} value={item}>
                  {formatEmotion(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Nhắc tôi xem lại quyết định
            <select
              value={reviewAfterDays}
              onChange={(event) =>
                setReviewAfterDays(Number(event.target.value) as ReviewInterval)
              }
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
            >
              <option value={7}>Sau 7 ngày</option>
              <option value={14}>Sau 14 ngày</option>
              <option value={30}>Sau 30 ngày</option>
            </select>
            <span className="font-normal text-[#66736c]">
              Lịch xem lại giúp kiểm tra luận điểm bằng dữ liệu, thay vì chỉ nhìn lãi/lỗ.
            </span>
          </label>

          <button
            type="submit"
            className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59]"
          >
            Xác nhận mô phỏng {side === "buy" ? "mua" : "bán"}
          </button>
        </form>

        <section className="overflow-hidden rounded-md border border-[#e0e5dc] bg-white shadow-sm">
          <div className="border-b border-[#e0e5dc] p-5">
            <h2 className="text-xl font-bold text-[#17201b]">Danh sách cổ phiếu theo Vnstock</h2>
            <p className="mt-2 text-sm leading-6 text-[#5b6861]">
              {MOCK_DATA_DISCLAIMER}
            </p>
          </div>
          <div className="max-h-[720px] overflow-auto jf-scrollbar">
            <table className="min-w-[760px] w-full text-left text-sm">
              <thead className="sticky top-0 bg-[#f3f7f0] text-xs uppercase text-[#66736c]">
                <tr>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Doanh nghiệp</th>
                  <th className="px-4 py-3">Ngành</th>
                  <th className="px-4 py-3">Giá</th>
                  <th className="px-4 py-3">Biến động</th>
                  <th className="px-4 py-3">Giá/LN</th>
                </tr>
              </thead>
              <tbody>
                {state.stocks.map((stock) => (
                  <tr
                    key={stock.ticker}
                    className="cursor-pointer border-t border-[#e0e5dc] hover:bg-[#f8fbf7]"
                    onClick={() => setTicker(stock.ticker)}
                  >
                    <td className="px-4 py-3 font-bold text-[#17201b]">{stock.ticker}</td>
                    <td className="px-4 py-3">{stock.companyName}</td>
                    <td className="px-4 py-3">{stock.sector}</td>
                    <td className="px-4 py-3">{formatPoints(stock.currentPrice)}</td>
                    <td className="px-4 py-3">{formatPercent(stock.dailyChangePercent)}</td>
                    <td className="px-4 py-3">{stock.peRatio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Disclaimer />
    </div>
  );
}
