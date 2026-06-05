import { fallbackMarketSummary } from "./fallbackSummary";
import { MARKET_WATCHLIST, toDirection, type MarketIndexItem, type MarketSummary, type MarketTickerItem } from "./summary";

type PriceBoardItemLike = {
  symbol: string;
  price: number;
  referencePrice: number;
  exchange?: string;
};

type QuoteHistoryLike = {
  close: number;
};

const INDEXES = [
  { code: "VNINDEX", name: "VN-INDEX" },
  { code: "VN30", name: "VN30" },
  { code: "HNXIndex", name: "HNX-INDEX" },
  { code: "HNXUpcomIndex", name: "UPCOM" },
];

function recentStartDate() {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  return date.toISOString().slice(0, 10);
}

function normalizeTicker(item: PriceBoardItemLike): MarketTickerItem | null {
  if (!Number.isFinite(item.price) || !Number.isFinite(item.referencePrice) || item.referencePrice <= 0) {
    return null;
  }

  const price = item.price * 1000;
  const previousClose = item.referencePrice * 1000;
  const change = price - previousClose;
  const changePercent = (change / previousClose) * 100;

  return {
    symbol: item.symbol,
    price,
    change,
    changePercent,
    direction: toDirection(changePercent),
    exchange: item.exchange,
  };
}

function normalizeIndex(
  code: string,
  name: string,
  rows: QuoteHistoryLike[],
): MarketIndexItem | null {
  if (rows.length < 2) {
    return null;
  }

  const latest = rows[rows.length - 1]?.close;
  const previous = rows[rows.length - 2]?.close;

  if (!Number.isFinite(latest) || !Number.isFinite(previous) || previous <= 0) {
    return null;
  }

  const value = latest * 1000;
  const previousValue = previous * 1000;
  const change = value - previousValue;
  const changePercent = (change / previousValue) * 100;

  return {
    code,
    name,
    value,
    change,
    changePercent,
    direction: toDirection(changePercent),
  };
}

export async function getVnstockMarketSummary(): Promise<MarketSummary> {
  const vnstock = await import("vnstock-js");
  const start = recentStartDate();

  const [board, indexGroups] = await Promise.all([
    vnstock.default.stock.trading.priceBoard(MARKET_WATCHLIST) as Promise<PriceBoardItemLike[]>,
    Promise.all(
      INDEXES.map(async (item) => {
        try {
          const rows = await vnstock.default.stock.quote.history({
            symbols: [item.code],
            start,
            timeFrame: "1D",
            countBack: 8,
          }) as QuoteHistoryLike[];

          return normalizeIndex(item.code, item.name, rows);
        } catch {
          return null;
        }
      }),
    ),
  ]);

  const tickers = board
    .map(normalizeTicker)
    .filter((item): item is MarketTickerItem => Boolean(item));

  const indices = indexGroups.filter((item): item is MarketIndexItem => Boolean(item));

  if (tickers.length === 0) {
    return {
      ...fallbackMarketSummary,
      updatedAt: new Date().toISOString(),
      notice: "Vnstock chua tra duoc bang gia, dang dung du lieu mo phong.",
    };
  }

  return {
    source: "vnstock",
    updatedAt: new Date().toISOString(),
    tickers,
    indices: indices.length > 0 ? indices : fallbackMarketSummary.indices,
  };
}
