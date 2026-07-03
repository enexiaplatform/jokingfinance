import { fallbackMarketSummary } from "@/lib/market-data/fallbackSummary";
import { getVnstockMarketSummary } from "@/lib/market-data/vnstockSummary";
import { withMarketFetchTime, type MarketSummary } from "@/lib/market-data/summary";

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
    const summary =
      provider === "mock"
        ? withMarketFetchTime(fallbackMarketSummary)
        : await getVnstockMarketSummary();
    cachedSummary = summary;
    cachedAt = now;

    return marketResponse(summary);
  } catch {
    const fallback = {
      ...fallbackMarketSummary,
      status: "failed" as const,
      fetchedAt: new Date().toISOString(),
      notice:
        "Không thể tải nguồn Vnstock. Đang dùng dữ liệu minh họa gần nhất, không phải giá hiện tại.",
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
