export type Stock = {
  id?: string;
  ticker: string;
  companyName: string;
  sector: string;
  currentPrice: number;
  previousClose: number;
  dailyChangePercent: number;
  peRatio: number;
  marketCap: number;
  description: string;
  isActive: boolean;
};

export type MarketDataProvider = {
  listStocks: () => Promise<Stock[]>;
  getStockByTicker: (ticker: string) => Promise<Stock | null>;
};
