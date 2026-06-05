import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import { getVnstockMarketSummary } from "@/lib/market-data/vnstockSummary";
import type { MarketSummary } from "@/lib/market-data/summary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_TTL_MS = 60_000;

let cachedSummary: MarketSummary | null = null;
let cachedAt = 0;

export async function GET() {
  const now = Date.now();

  if (cachedSummary && now - cachedAt < CACHE_TTL_MS) {
    return marketResponse(cachedSummary);
  }

  try {
    const provider = process.env.MARKET_DATA_SOURCE ?? "vnstock";
    const summary = provider === "mock" ? fallbackMarketSummary : await getVnstockMarketSummary();
    cachedSummary = summary;
    cachedAt = now;

    return marketResponse(summary);
  } catch {
    const fallback = {
      ...fallbackMarketSummary,
      updatedAt: new Date().toISOString(),
      notice: "Nguon Vnstock dang loi hoac bi gioi han, dang dung du lieu mo phong.",
    };

    cachedSummary = fallback;
    cachedAt = now;

    return marketResponse(fallback);
  }
}

function marketResponse(summary: MarketSummary) {
  return Response.json(summary, {
    headers: {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
    },
  });
}
