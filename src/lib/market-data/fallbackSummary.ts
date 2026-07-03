import type { MarketSummary } from "./summary";

export const fallbackMarketSummary: MarketSummary = {
  source: "mock",
  status: "demo",
  updatedAt: new Date("2026-06-05T09:45:00+07:00").toISOString(),
  fetchedAt: new Date("2026-06-05T09:45:00+07:00").toISOString(),
  notice: "Đang hiển thị dữ liệu minh họa, không phải giá thị trường hiện tại.",
  tickers: [
    { symbol: "FPT", price: 138500, change: 8900, changePercent: 6.87, direction: "up", exchange: "HSX" },
    { symbol: "PNJ", price: 97200, change: 5100, changePercent: 5.54, direction: "up", exchange: "HSX" },
    { symbol: "HPG", price: 29850, change: 1450, changePercent: 5.11, direction: "up", exchange: "HSX" },
    { symbol: "VIC", price: 41200, change: -2350, changePercent: -5.4, direction: "down", exchange: "HSX" },
    { symbol: "NVL", price: 11450, change: -560, changePercent: -4.66, direction: "down", exchange: "HSX" },
    { symbol: "VCB", price: 92500, change: 1000, changePercent: 1.1, direction: "up", exchange: "HSX" },
    { symbol: "MSN", price: 71800, change: -1000, changePercent: -1.37, direction: "down", exchange: "HSX" },
  ],
  indices: [
    { code: "VNINDEX", name: "VN-INDEX", value: 1843.09, change: 11.54, changePercent: 0.63, direction: "up" },
    { code: "VN30", name: "VN30", value: 1962.4, change: 9.82, changePercent: 0.5, direction: "up" },
    { code: "HNXIndex", name: "HNX-INDEX", value: 294.06, change: -3.54, changePercent: -1.19, direction: "down" },
    { code: "HNXUpcomIndex", name: "UPCOM", value: 98.72, change: 0.41, changePercent: 0.42, direction: "up" },
  ],
};
