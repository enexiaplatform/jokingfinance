import { getMarketDataProvider } from "@/lib/market-data/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const stocks = await getMarketDataProvider().listStocks();

  return Response.json(
    {
      source: process.env.MARKET_DATA_SOURCE === "mock" ? "mock" : "vnstock",
      updatedAt: new Date().toISOString(),
      stocks,
    },
    {
      headers: {
        "Cache-Control": "s-maxage=60, stale-while-revalidate=300",
      },
    },
  );
}
