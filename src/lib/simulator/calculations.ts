import { INITIAL_VIRTUAL_POINTS, TRADE_FEE_RATE } from "@/lib/constants";
import type {
  Holding,
  PortfolioState,
  ReviewInterval,
  Trade,
  TradeInput,
} from "./types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function getTradeReviewDueAt(
  createdAt: string,
  reviewAfterDays: ReviewInterval = 7,
) {
  return new Date(new Date(createdAt).getTime() + reviewAfterDays * DAY_IN_MS).toISOString();
}

export function getTradeReviewSchedule(
  state: Pick<PortfolioState, "trades" | "journal">,
  now = new Date(),
) {
  return state.trades
    .map((trade) => {
      const entry = state.journal.find((item) => item.tradeId === trade.id);
      const dueAt =
        trade.reviewDueAt ||
        getTradeReviewDueAt(trade.createdAt, trade.reviewAfterDays || 7);
      const daysUntil = Math.ceil(
        (new Date(dueAt).getTime() - now.getTime()) / DAY_IN_MS,
      );

      return {
        trade,
        entry,
        dueAt,
        daysUntil,
        status: entry?.reviewedAt
          ? ("completed" as const)
          : daysUntil <= 0
            ? ("due" as const)
            : ("upcoming" as const),
      };
    })
    .sort((a, b) => {
      const statusOrder = { due: 0, upcoming: 1, completed: 2 };
      return (
        statusOrder[a.status] - statusOrder[b.status] ||
        new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
      );
    });
}

export function normalizeTradeReview(trade: Trade): Trade {
  const reviewAfterDays = trade.reviewAfterDays || 7;

  return {
    ...trade,
    reviewAfterDays,
    reviewDueAt:
      trade.reviewDueAt || getTradeReviewDueAt(trade.createdAt, reviewAfterDays),
  };
}

export function estimateBuyCost(quantity: number, price: number) {
  const gross = quantity * price;
  const fee = gross * TRADE_FEE_RATE;
  return {
    gross,
    fee,
    net: gross + fee,
  };
}

export function estimateSellProceeds(quantity: number, price: number) {
  const gross = quantity * price;
  const fee = gross * TRADE_FEE_RATE;
  return {
    gross,
    fee,
    net: gross - fee,
  };
}

export function createInitialPortfolioState(): PortfolioState {
  return {
    displayName: "",
    startingCash: INITIAL_VIRTUAL_POINTS,
    cash: INITIAL_VIRTUAL_POINTS,
    stocks: [],
    holdings: [],
    trades: [],
    journal: [],
    missionProgress: [],
    missions: [],
    source: "demo",
  };
}

export function getStockPrice(state: PortfolioState, ticker: string) {
  return state.stocks.find((stock) => stock.ticker === ticker)?.currentPrice ?? 0;
}

export function getHoldingRows(state: PortfolioState) {
  const holdingsValue = state.holdings.reduce((total, holding) => {
    return total + holding.quantity * getStockPrice(state, holding.ticker);
  }, 0);
  const portfolioValue = state.cash + holdingsValue;

  return state.holdings.map((holding) => {
    const stock = state.stocks.find((item) => item.ticker === holding.ticker);
    const currentPrice = stock?.currentPrice ?? holding.averagePrice;
    const marketValue = currentPrice * holding.quantity;
    const costBasis = holding.averagePrice * holding.quantity;
    const pnl = marketValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const weight = portfolioValue > 0 ? (marketValue / portfolioValue) * 100 : 0;

    return {
      ...holding,
      stock,
      currentPrice,
      marketValue,
      pnl,
      pnlPercent,
      weight,
    };
  });
}

export function getPortfolioSummary(state: PortfolioState) {
  const holdingRows = getHoldingRows(state);
  const holdingsValue = holdingRows.reduce((total, holding) => total + holding.marketValue, 0);
  const portfolioValue = state.cash + holdingsValue;
  const pnl = portfolioValue - state.startingCash;
  const pnlPercent = state.startingCash > 0 ? (pnl / state.startingCash) * 100 : 0;
  const sortedByWeight = [...holdingRows].sort((a, b) => b.weight - a.weight);
  const sortedByPnl = [...holdingRows].sort((a, b) => b.pnlPercent - a.pnlPercent);
  const topHolding = sortedByWeight[0];
  const topWinner = sortedByPnl[0];
  const topLoser = sortedByPnl[sortedByPnl.length - 1];

  return {
    holdingsValue,
    portfolioValue,
    pnl,
    pnlPercent,
    holdingsCount: holdingRows.length,
    holdingRows,
    topHolding,
    topWinner,
    topLoser,
    concentrationWarning:
      topHolding && topHolding.weight > 30
        ? `${topHolding.ticker} đang chiếm ${topHolding.weight.toFixed(1)}% danh mục ảo. Hãy xem lại rủi ro tập trung.`
        : "",
  };
}

export function validateTradeInput(input: TradeInput) {
  if (!input.ticker) {
    return "Chọn một mã cổ phiếu mô phỏng.";
  }

  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    return "Số lượng phải lớn hơn 0.";
  }

  if (input.thesis.trim().length < 10) {
    return "Hãy viết ít nhất 10 ký tự về lý do mua hoặc bán trước khi xác nhận.";
  }

  return "";
}

export function updateHoldingAfterBuy(
  holdings: Holding[],
  ticker: string,
  quantity: number,
  price: number,
  stockId?: string,
) {
  const existing = holdings.find((holding) => holding.ticker === ticker);
  const now = new Date().toISOString();

  if (!existing) {
    return [
      ...holdings,
      {
        ticker,
        stockId,
        quantity,
        averagePrice: price,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }

  const nextQuantity = existing.quantity + quantity;
  const nextAveragePrice =
    (existing.quantity * existing.averagePrice + quantity * price) / nextQuantity;

  return holdings.map((holding) =>
    holding.ticker === ticker
      ? {
          ...holding,
          stockId: stockId ?? holding.stockId,
          quantity: nextQuantity,
          averagePrice: nextAveragePrice,
          updatedAt: now,
        }
      : holding,
  );
}

export function updateHoldingAfterSell(
  holdings: Holding[],
  ticker: string,
  quantity: number,
) {
  const now = new Date().toISOString();

  return holdings
    .map((holding) => {
      if (holding.ticker !== ticker) {
        return holding;
      }

      return {
        ...holding,
        quantity: holding.quantity - quantity,
        updatedAt: now,
      };
    })
    .filter((holding) => holding.quantity > 0);
}
