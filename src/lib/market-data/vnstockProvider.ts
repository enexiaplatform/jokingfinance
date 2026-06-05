import { mockStocks } from "./mockProvider";
import type { MarketDataProvider, Stock } from "./types";

type PriceBoardItemLike = {
  symbol: string;
  companyName?: string;
  exchange?: string;
  price: number;
  referencePrice: number;
  totalValue?: number;
};

const fallbackByTicker = new Map(mockStocks.map((stock) => [stock.ticker, stock]));

function normalizeStock(item: PriceBoardItemLike): Stock | null {
  if (!Number.isFinite(item.price) || !Number.isFinite(item.referencePrice) || item.referencePrice <= 0) {
    return null;
  }

  const fallback = fallbackByTicker.get(item.symbol);
  const currentPrice = item.price * 1000;
  const previousClose = item.referencePrice * 1000;
  const dailyChangePercent = ((currentPrice - previousClose) / previousClose) * 100;

  return {
    id: fallback?.id ?? item.symbol,
    ticker: item.symbol,
    companyName: item.companyName ?? fallback?.companyName ?? item.symbol,
    sector: fallback?.sector ?? item.exchange ?? "Chưa phân ngành",
    currentPrice,
    previousClose,
    dailyChangePercent,
    peRatio: fallback?.peRatio ?? 0,
    marketCap: fallback?.marketCap ?? 0,
    description:
      fallback?.description ??
      "Giá và biến động lấy từ Vnstock cho mục đích học tập trong danh mục ảo.",
    isActive: true,
  };
}

export async function fetchVnstockStocks(tickers = mockStocks.map((stock) => stock.ticker)) {
  const vnstock = await import("vnstock-js");
  const board = await vnstock.default.stock.trading.priceBoard(tickers) as PriceBoardItemLike[];

  return board
    .map(normalizeStock)
    .filter((stock): stock is Stock => Boolean(stock));
}

export const vnstockMarketDataProvider: MarketDataProvider = {
  async listStocks() {
    try {
      const stocks = await fetchVnstockStocks();

      return stocks.length > 0 ? stocks : mockStocks;
    } catch {
      return mockStocks;
    }
  },
  async getStockByTicker(ticker: string) {
    try {
      const [stock] = await fetchVnstockStocks([ticker.toUpperCase()]);

      return stock ?? fallbackByTicker.get(ticker.toUpperCase()) ?? null;
    } catch {
      return fallbackByTicker.get(ticker.toUpperCase()) ?? null;
    }
  },
};
