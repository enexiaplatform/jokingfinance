import { mockMarketDataProvider } from "./mockProvider";
import type { MarketDataProvider } from "./types";

export function getMarketDataProvider(): MarketDataProvider {
  return mockMarketDataProvider;
}
