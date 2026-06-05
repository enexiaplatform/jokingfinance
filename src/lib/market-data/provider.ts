import { mockMarketDataProvider } from "./mockProvider";
import { vnstockMarketDataProvider } from "./vnstockProvider";
import type { MarketDataProvider } from "./types";

export function getMarketDataProvider(): MarketDataProvider {
  if (process.env.MARKET_DATA_SOURCE === "mock") {
    return mockMarketDataProvider;
  }

  return vnstockMarketDataProvider;
}
