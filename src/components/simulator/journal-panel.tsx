"use client";

import { FormEvent, useMemo, useState } from "react";
import type { MistakeType } from "@/lib/simulator/types";
import { formatDate, formatEmotion, formatMistakeType, formatTradeSide } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Disclaimer } from "@/components/ui/disclaimer";
import { useVirtualPortfolio } from "./use-virtual-portfolio";

const mistakeTypes: MistakeType[] = [
  "FOMO",
  "Over-concentration",
  "No thesis",
  "Panic selling",
  "Chasing news",
  "Ignoring risk",
  "Good discipline",
  "Other",
];

export function JournalPanel() {
  const { state, loading, message, updateJournal } = useVirtualPortfolio();
  const [selectedTradeId, setSelectedTradeId] = useState("");
  const [tickerFilter, setTickerFilter] = useState("");
  const [emotionFilter, setEmotionFilter] = useState("");
  const [mistakeFilter, setMistakeFilter] = useState("");
  const selectedTrade = state.trades.find((trade) => trade.id === selectedTradeId) ?? state.trades[0];
  const existingEntry = selectedTrade
    ? state.journal.find((entry) => entry.tradeId === selectedTrade.id)
    : undefined;
  const [reflection, setReflection] = useState("");
  const [lessonLearned, setLessonLearned] = useState("");
  const [mistakeType, setMistakeType] = useState<MistakeType>("Other");
  const [confidenceScore, setConfidenceScore] = useState(3);

  const filteredTrades = useMemo(() => {
    return state.trades.filter((trade) => {
      const entry = state.journal.find((item) => item.tradeId === trade.id);
      const matchesTicker = tickerFilter ? trade.ticker === tickerFilter : true;
      const matchesEmotion = emotionFilter ? trade.emotion === emotionFilter : true;
      const matchesMistake = mistakeFilter ? entry?.mistakeType === mistakeFilter : true;
      return matchesTicker && matchesEmotion && matchesMistake;
    });
  }, [emotionFilter, mistakeFilter, state.journal, state.trades, tickerFilter]);

  function loadEntry(tradeId: string) {
    const trade = state.trades.find((item) => item.id === tradeId);
    const entry = state.journal.find((item) => item.tradeId === tradeId);

    if (!trade) return;

    setSelectedTradeId(trade.id);
    setReflection(entry?.reflection ?? "");
    setLessonLearned(entry?.lessonLearned ?? "");
    setMistakeType(entry?.mistakeType ?? "Other");
    setConfidenceScore(entry?.confidenceScore ?? 3);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTrade) return;

    updateJournal({
      tradeId: selectedTrade.id,
      reflection,
      lessonLearned,
      mistakeType,
      confidenceScore,
      updatedAt: new Date().toISOString(),
    });
  }

  if (loading) {
    return <div className="rounded-md border border-[#d9ddd3] bg-white p-6">Đang tải nhật ký...</div>;
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#17201b]">Nhật ký giao dịch</h1>
        <p className="mt-2 text-[#5b6861]">Ghi phần tự xem lại sau giao dịch để biến quyết định thành bài học.</p>
      </div>

      {message ? (
        <p className="rounded-md border border-[#d9ddd3] bg-white p-3 text-sm text-[#4c5d54]">
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#17201b]">Bộ lọc</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3 xl:grid-cols-1">
            <select
              value={tickerFilter}
              onChange={(event) => setTickerFilter(event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm"
            >
              <option value="">Tất cả mã</option>
              {[...new Set(state.trades.map((trade) => trade.ticker))].map((ticker) => (
                <option key={ticker} value={ticker}>
                  {ticker}
                </option>
              ))}
            </select>
            <select
              value={emotionFilter}
              onChange={(event) => setEmotionFilter(event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm"
            >
              <option value="">Tất cả cảm xúc</option>
              {[...new Set(state.trades.map((trade) => trade.emotion))].map((emotion) => (
                <option key={emotion} value={emotion}>
                  {formatEmotion(emotion)}
                </option>
              ))}
            </select>
            <select
              value={mistakeFilter}
              onChange={(event) => setMistakeFilter(event.target.value)}
              className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3 text-sm"
            >
              <option value="">Tất cả loại lỗi</option>
              {mistakeTypes.map((type) => (
                <option key={type} value={type}>
                  {formatMistakeType(type)}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 grid gap-3">
            {filteredTrades.map((trade) => (
              <button
                key={trade.id}
                type="button"
                onClick={() => loadEntry(trade.id)}
                className="rounded-md border border-[#e0e5dc] p-3 text-left hover:border-[#0f766e]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-bold text-[#17201b]">
                    {formatTradeSide(trade.side)} {trade.ticker}
                  </span>
                  <Badge tone={trade.emotion === "FOMO" ? "coral" : "neutral"}>
                    {formatEmotion(trade.emotion)}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-[#5b6861]">
                  {trade.thesis || "Chưa có luận điểm"}
                </p>
              </button>
            ))}
            {filteredTrades.length === 0 ? (
              <p className="text-sm text-[#5b6861]">Chưa có giao dịch phù hợp.</p>
            ) : null}
          </div>
        </section>

        <form onSubmit={handleSubmit} className="grid gap-4 rounded-md border border-[#e0e5dc] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-bold text-[#17201b]">Tự xem lại</h2>
          {selectedTrade ? (
            <div className="rounded-md border border-[#d9ddd3] bg-[#f8fbf7] p-4 text-sm">
              <p className="font-bold text-[#17201b]">
                {formatTradeSide(selectedTrade.side)} {selectedTrade.quantity} {selectedTrade.ticker}
              </p>
              <p className="mt-1 text-[#66736c]">{formatDate(selectedTrade.createdAt)}</p>
              <p className="mt-3 leading-6 text-[#4c5d54]">
                Luận điểm: {selectedTrade.thesis || "Chưa có luận điểm."}
              </p>
              {existingEntry ? (
                <p className="mt-2 text-xs font-semibold text-[#0f766e]">
                  Đã có phần tự xem lại, bạn có thể chỉnh sửa.
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[#5b6861]">Chưa có giao dịch để ghi nhật ký.</p>
          )}

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Điều gì đã xảy ra?
            <textarea
              value={reflection}
              onChange={(event) => setReflection(event.target.value)}
              rows={4}
              className="rounded-md border border-[#d9ddd3] px-3 py-2"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-[#314039]">
            Tôi học được gì?
            <textarea
              value={lessonLearned}
              onChange={(event) => setLessonLearned(event.target.value)}
              rows={3}
              className="rounded-md border border-[#d9ddd3] px-3 py-2"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold text-[#314039]">
              Loại lỗi hoặc điểm mạnh
              <select
                value={mistakeType}
                onChange={(event) => setMistakeType(event.target.value as MistakeType)}
                className="min-h-11 rounded-md border border-[#d9ddd3] bg-white px-3"
              >
                {mistakeTypes.map((type) => (
                  <option key={type} value={type}>
                    {formatMistakeType(type)}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-[#314039]">
              Mức tự tin: {confidenceScore}
              <input
                type="range"
                min={1}
                max={5}
                value={confidenceScore}
                onChange={(event) => setConfidenceScore(Number(event.target.value))}
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={!selectedTrade}
            className="min-h-11 rounded-md bg-[#0f766e] px-4 text-sm font-semibold text-white hover:bg-[#115e59] disabled:opacity-60"
          >
            Lưu phần tự xem lại
          </button>
        </form>
      </div>

      <Disclaimer />
    </div>
  );
}
