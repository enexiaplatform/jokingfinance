export type MarketDirection = "up" | "down" | "flat";
export type MarketDataStatus = "delayed" | "demo" | "failed";

export type MarketTickerItem = {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  direction: MarketDirection;
  exchange?: string;
};

export type MarketIndexItem = {
  code: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
  direction: MarketDirection;
};

export type MarketSummary = {
  source: "vnstock" | "mock";
  status: MarketDataStatus;
  updatedAt: string;
  fetchedAt: string;
  tickers: MarketTickerItem[];
  indices: MarketIndexItem[];
  notice?: string;
};

export function withMarketFetchTime(
  summary: MarketSummary,
  fetchedAt = new Date().toISOString(),
): MarketSummary {
  return {
    ...summary,
    fetchedAt,
  };
}

export const MARKET_WATCHLIST = ["FPT", "PNJ", "HPG", "VIC", "NVL", "VCB", "MSN"];

export function toDirection(changePercent: number): MarketDirection {
  if (changePercent > 0) {
    return "up";
  }

  if (changePercent < 0) {
    return "down";
  }

  return "flat";
}
