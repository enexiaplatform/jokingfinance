"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sampleMissions, type Mission } from "@/data/sample-content";
import { mockStocks } from "@/lib/market-data/mockProvider";
import type { Stock } from "@/lib/market-data/types";
import {
  createInitialPortfolioState,
  estimateBuyCost,
  estimateSellProceeds,
  getPortfolioSummary,
  updateHoldingAfterBuy,
  updateHoldingAfterSell,
  validateTradeInput,
} from "@/lib/simulator/calculations";
import type {
  JournalEntry,
  MissionProgress,
  MistakeType,
  PortfolioState,
  Trade,
  TradeInput,
} from "@/lib/simulator/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const STORAGE_KEY = "jokingfinance-portfolio-v1";
const DISPLAY_NAME_KEY = "jokingfinance-display-name";

type RemoteContext = {
  userId: string;
  portfolioId: string;
};

type StockRow = {
  id: string;
  ticker: string;
  company_name: string;
  sector: string;
  current_price: number;
  previous_close: number;
  daily_change_percent: number;
  pe_ratio: number;
  market_cap: number;
  description: string;
  is_active: boolean;
};

type PortfolioRow = {
  id: string;
  current_cash: number;
  starting_cash: number;
};

type HoldingRow = {
  stock_id?: string | null;
  ticker: string;
  quantity: number;
  average_price: number;
  created_at: string;
  updated_at: string;
};

type TradeRow = {
  id: string;
  stock_id?: string | null;
  ticker: string;
  side: "buy" | "sell";
  quantity: number;
  price: number;
  gross_value: number;
  fee: number;
  net_value: number;
  thesis?: string | null;
  expected_holding_period?: string | null;
  risk_note?: string | null;
  emotion?: Trade["emotion"] | null;
  created_at: string;
};

type JournalRow = {
  trade_id: string;
  reflection?: string | null;
  lesson_learned?: string | null;
  mistake_type?: MistakeType | null;
  confidence_score?: number | null;
  updated_at: string;
};

type MissionRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: Mission["difficulty"];
  category: string;
  estimated_minutes: number;
  objective: string;
  instructions: string;
  success_criteria: string;
  related_article_slug?: string | null;
  is_active: boolean;
};

type MissionProgressRow = {
  mission_id?: string | null;
  status: MissionProgress["status"];
  started_at?: string | null;
  completed_at?: string | null;
  notes?: string | null;
  missions?: {
    slug?: string | null;
  } | null;
};

type MarketStocksResponse = {
  source: "vnstock" | "mock";
  stocks: Stock[];
};

function mapStock(row: StockRow): Stock {
  return {
    id: row.id,
    ticker: row.ticker,
    companyName: row.company_name,
    sector: row.sector,
    currentPrice: row.current_price,
    previousClose: row.previous_close,
    dailyChangePercent: row.daily_change_percent,
    peRatio: row.pe_ratio,
    marketCap: row.market_cap,
    description: row.description,
    isActive: row.is_active,
  };
}

function mapMission(row: MissionRow): Mission {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    difficulty: row.difficulty,
    category: row.category,
    estimatedMinutes: row.estimated_minutes,
    objective: row.objective,
    instructions: row.instructions.split("\n").filter(Boolean),
    successCriteria: row.success_criteria.split("\n").filter(Boolean),
    relatedArticleSlug: row.related_article_slug ?? undefined,
    isActive: row.is_active,
  };
}

function parseStoredState() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return null;

    return JSON.parse(value) as PortfolioState;
  } catch {
    return null;
  }
}

function persistLocal(state: PortfolioState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function fetchLiveStocks() {
  try {
    const response = await fetch("/api/market/stocks", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Market stocks request failed");
    }

    const data = (await response.json()) as MarketStocksResponse;

    return data.stocks.length > 0 ? data.stocks : null;
  } catch {
    return null;
  }
}

function createTrade(input: TradeInput, side: "buy" | "sell", price: number) {
  const estimate =
    side === "buy"
      ? estimateBuyCost(input.quantity, price)
      : estimateSellProceeds(input.quantity, price);

  return {
    id: crypto.randomUUID(),
    ticker: input.ticker,
    side,
    quantity: input.quantity,
    price,
    grossValue: estimate.gross,
    fee: estimate.fee,
    netValue: estimate.net,
    thesis: input.thesis,
    expectedHoldingPeriod: input.expectedHoldingPeriod,
    riskNote: input.riskNote,
    emotion: input.emotion,
    createdAt: new Date().toISOString(),
  } satisfies Trade;
}

export function useVirtualPortfolio() {
  const [state, setState] = useState<PortfolioState>(() => ({
    ...createInitialPortfolioState(),
    stocks: mockStocks,
    missions: sampleMissions,
  }));
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const remoteRef = useRef<RemoteContext | null>(null);

  const loadRemoteState = useCallback(async () => {
    const supabase = createSupabaseBrowserClient();
    const storedState = parseStoredState();
    const displayName = localStorage.getItem(DISPLAY_NAME_KEY) ?? "";
    const liveStocks = await fetchLiveStocks();
    const defaultStocks = liveStocks ?? mockStocks;

    if (storedState) {
      setState({
        ...storedState,
        displayName: storedState.displayName || displayName,
        stocks: defaultStocks,
        missions: storedState.missions.length > 0 ? storedState.missions : sampleMissions,
        source: liveStocks ? "vnstock" : storedState.source,
      });
    }

    if (!supabase) {
      if (!storedState && liveStocks) {
        setState((current) => ({
          ...current,
          stocks: liveStocks,
          source: "vnstock",
        }));
      }
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (!storedState && liveStocks) {
        setState((current) => ({
          ...current,
          stocks: liveStocks,
          source: "vnstock",
        }));
      }
      setLoading(false);
      return;
    }

    const [{ data: stockRows }, { data: missionRows }] = await Promise.all([
      supabase.from("stocks").select("*").eq("is_active", true).order("ticker"),
      supabase.from("missions").select("*").eq("is_active", true).order("created_at"),
    ]);

    const { data: portfolioRows } = await supabase
      .from("portfolios")
      .select("id,current_cash,starting_cash")
      .eq("user_id", user.id)
      .limit(1);

    let portfolio = portfolioRows?.[0] as PortfolioRow | undefined;

    if (!portfolio) {
      const { data: inserted } = await supabase
        .from("portfolios")
        .insert({
          user_id: user.id,
          name: "Danh mục ảo mặc định",
        })
        .select("id,current_cash,starting_cash")
        .single();

      portfolio = inserted as PortfolioRow | undefined;
    }

    if (!portfolio) {
      setLoading(false);
      return;
    }

    remoteRef.current = {
      userId: user.id,
      portfolioId: portfolio.id,
    };

    const [{ data: holdingRows }, { data: tradeRows }, { data: journalRows }, { data: progressRows }, { data: profileRows }] =
      await Promise.all([
        supabase
          .from("holdings")
          .select("stock_id,ticker,quantity,average_price,created_at,updated_at")
          .eq("user_id", user.id)
          .eq("portfolio_id", portfolio.id),
        supabase
          .from("trades")
          .select("*")
          .eq("user_id", user.id)
          .eq("portfolio_id", portfolio.id)
          .order("created_at", { ascending: false }),
        supabase.from("trade_journal").select("*").eq("user_id", user.id),
        supabase
          .from("user_mission_progress")
          .select("mission_id,status,started_at,completed_at,notes,missions(slug)")
          .eq("user_id", user.id),
        supabase.from("profiles").select("display_name").eq("user_id", user.id).limit(1),
      ]);

    const stocks = liveStocks ?? (stockRows && stockRows.length > 0 ? (stockRows as StockRow[]).map(mapStock) : mockStocks);
    const missions =
      missionRows && missionRows.length > 0
        ? (missionRows as MissionRow[]).map(mapMission)
        : sampleMissions;

    const nextState: PortfolioState = {
      displayName:
        (profileRows?.[0] as { display_name?: string } | undefined)?.display_name ??
        displayName,
      startingCash: portfolio.starting_cash,
      cash: portfolio.current_cash,
      stocks,
      missions,
      source: liveStocks ? "vnstock" : "supabase",
      holdings: ((holdingRows ?? []) as HoldingRow[]).map((holding) => ({
        ticker: holding.ticker,
        stockId: holding.stock_id ?? undefined,
        quantity: holding.quantity,
        averagePrice: holding.average_price,
        createdAt: holding.created_at,
        updatedAt: holding.updated_at,
      })),
      trades: ((tradeRows ?? []) as TradeRow[]).map((trade) => ({
        id: trade.id,
        stockId: trade.stock_id ?? undefined,
        ticker: trade.ticker,
        side: trade.side,
        quantity: trade.quantity,
        price: trade.price,
        grossValue: trade.gross_value,
        fee: trade.fee,
        netValue: trade.net_value,
        thesis: trade.thesis ?? "",
        expectedHoldingPeriod: trade.expected_holding_period ?? "",
        riskNote: trade.risk_note ?? "",
        emotion: trade.emotion ?? "calm",
        createdAt: trade.created_at,
      })),
      journal: ((journalRows ?? []) as JournalRow[]).map((entry) => ({
        tradeId: entry.trade_id,
        reflection: entry.reflection ?? "",
        lessonLearned: entry.lesson_learned ?? "",
        mistakeType: entry.mistake_type ?? "Other",
        confidenceScore: entry.confidence_score ?? 3,
        updatedAt: entry.updated_at,
      })),
      missionProgress: ((progressRows ?? []) as MissionProgressRow[]).map((progress) => ({
        missionId: progress.mission_id ?? undefined,
        missionSlug: progress.missions?.slug ?? "",
        status: progress.status,
        startedAt: progress.started_at ?? undefined,
        completedAt: progress.completed_at ?? undefined,
        notes: progress.notes ?? "",
      })),
    };

    persistLocal(nextState);
    setState(nextState);
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadRemoteState();
    });
  }, [loadRemoteState]);

  const summary = useMemo(() => getPortfolioSummary(state), [state]);

  const syncTrade = useCallback(async (nextState: PortfolioState, trade: Trade) => {
    const supabase = createSupabaseBrowserClient();
    const remote = remoteRef.current;
    const stock = nextState.stocks.find((item) => item.ticker === trade.ticker);

    if (!supabase || !remote || !stock?.id) {
      return;
    }

    await Promise.all([
      supabase
        .from("portfolios")
        .update({ current_cash: nextState.cash })
        .eq("id", remote.portfolioId)
        .eq("user_id", remote.userId),
      supabase
        .from("profiles")
        .update({ current_cash: nextState.cash })
        .eq("user_id", remote.userId),
    ]);

    await supabase.from("trades").upsert({
      id: trade.id,
      user_id: remote.userId,
      portfolio_id: remote.portfolioId,
      stock_id: stock.id,
      ticker: trade.ticker,
      side: trade.side,
      quantity: trade.quantity,
      price: trade.price,
      gross_value: trade.grossValue,
      fee: trade.fee,
      net_value: trade.netValue,
      thesis: trade.thesis,
      expected_holding_period: trade.expectedHoldingPeriod,
      risk_note: trade.riskNote,
      emotion: trade.emotion,
      created_at: trade.createdAt,
    });

    const holding = nextState.holdings.find((item) => item.ticker === trade.ticker);

    if (!holding) {
      await supabase
        .from("holdings")
        .delete()
        .eq("user_id", remote.userId)
        .eq("portfolio_id", remote.portfolioId)
        .eq("ticker", trade.ticker);
      return;
    }

    await supabase.from("holdings").upsert(
      {
        user_id: remote.userId,
        portfolio_id: remote.portfolioId,
        stock_id: stock.id,
        ticker: holding.ticker,
        quantity: holding.quantity,
        average_price: holding.averagePrice,
        updated_at: holding.updatedAt,
      },
      { onConflict: "user_id,portfolio_id,ticker" },
    );
  }, []);

  const buyStock = useCallback(
    (input: TradeInput) => {
      const inputError = validateTradeInput(input);
      if (inputError) {
        setMessage(inputError);
        return;
      }

      setState((current) => {
        const stock = current.stocks.find((item) => item.ticker === input.ticker);
        if (!stock) {
          setMessage("Không tìm thấy mã cổ phiếu mô phỏng.");
          return current;
        }

        const estimate = estimateBuyCost(input.quantity, stock.currentPrice);
        if (estimate.net > current.cash) {
          setMessage("Tiền ảo không đủ để mua số lượng này.");
          return current;
        }

        const trade = {
          ...createTrade(input, "buy", stock.currentPrice),
          stockId: stock.id,
        };
        const nextState = {
          ...current,
          cash: current.cash - estimate.net,
          holdings: updateHoldingAfterBuy(
            current.holdings,
            stock.ticker,
            input.quantity,
            stock.currentPrice,
            stock.id,
          ),
          trades: [trade, ...current.trades],
        };

        persistLocal(nextState);
        void syncTrade(nextState, trade);
        setMessage(`Đã mua mô phỏng ${input.quantity} ${stock.ticker}.`);
        return nextState;
      });
    },
    [syncTrade],
  );

  const sellStock = useCallback(
    (input: TradeInput) => {
      const inputError = validateTradeInput(input);
      if (inputError) {
        setMessage(inputError);
        return;
      }

      setState((current) => {
        const stock = current.stocks.find((item) => item.ticker === input.ticker);
        const holding = current.holdings.find((item) => item.ticker === input.ticker);

        if (!stock || !holding) {
          setMessage("Bạn chưa nắm giữ mã này.");
          return current;
        }

        if (input.quantity > holding.quantity) {
          setMessage("Không thể bán nhiều hơn số lượng đang nắm giữ.");
          return current;
        }

        const estimate = estimateSellProceeds(input.quantity, stock.currentPrice);
        const trade = {
          ...createTrade(input, "sell", stock.currentPrice),
          stockId: stock.id,
        };
        const nextState = {
          ...current,
          cash: current.cash + estimate.net,
          holdings: updateHoldingAfterSell(current.holdings, stock.ticker, input.quantity),
          trades: [trade, ...current.trades],
        };

        persistLocal(nextState);
        void syncTrade(nextState, trade);
        setMessage(`Đã bán mô phỏng ${input.quantity} ${stock.ticker}.`);
        return nextState;
      });
    },
    [syncTrade],
  );

  const updateJournal = useCallback((entry: JournalEntry) => {
    setState((current) => {
      const nextJournal = [
        entry,
        ...current.journal.filter((item) => item.tradeId !== entry.tradeId),
      ];
      const nextState = { ...current, journal: nextJournal };
      persistLocal(nextState);
      setMessage("Đã lưu phần tự xem lại.");

      const supabase = createSupabaseBrowserClient();
      const remote = remoteRef.current;

      if (supabase && remote) {
        void supabase.from("trade_journal").upsert(
          {
            user_id: remote.userId,
            trade_id: entry.tradeId,
            reflection: entry.reflection,
            lesson_learned: entry.lessonLearned,
            mistake_type: entry.mistakeType,
            confidence_score: entry.confidenceScore,
            updated_at: entry.updatedAt,
          },
          { onConflict: "trade_id" },
        );
      }

      return nextState;
    });
  }, []);

  const updateMissionProgress = useCallback(
    (missionSlug: string, status: MissionProgress["status"], notes = "") => {
      setState((current) => {
        const mission = current.missions.find((item) => item.slug === missionSlug);
        const existing = current.missionProgress.find(
          (item) => item.missionSlug === missionSlug,
        );
        const now = new Date().toISOString();
        const progress: MissionProgress = {
          missionSlug,
          missionId: mission?.id ?? existing?.missionId,
          status,
          startedAt: existing?.startedAt ?? (status === "in_progress" ? now : undefined),
          completedAt: status === "completed" ? now : existing?.completedAt,
          notes: notes || existing?.notes || "",
        };
        const nextState = {
          ...current,
          missionProgress: [
            progress,
            ...current.missionProgress.filter((item) => item.missionSlug !== missionSlug),
          ],
        };

        persistLocal(nextState);
        setMessage(
          status === "completed" ? "Nhiệm vụ đã hoàn thành." : "Nhiệm vụ đã bắt đầu.",
        );

        const supabase = createSupabaseBrowserClient();
        const remote = remoteRef.current;

        if (supabase && remote && progress.missionId) {
          void supabase.from("user_mission_progress").upsert(
            {
              user_id: remote.userId,
              mission_id: progress.missionId,
              status: progress.status,
              started_at: progress.startedAt,
              completed_at: progress.completedAt,
              notes: progress.notes,
            },
            { onConflict: "user_id,mission_id" },
          );
        }

        return nextState;
      });
    },
    [],
  );

  const updateDisplayName = useCallback((displayName: string) => {
    setState((current) => {
      const nextState = { ...current, displayName };
      persistLocal(nextState);
      localStorage.setItem(DISPLAY_NAME_KEY, displayName);
      setMessage("Đã lưu tên hiển thị.");

      const supabase = createSupabaseBrowserClient();
      const remote = remoteRef.current;

      if (supabase && remote) {
        void supabase
          .from("profiles")
          .update({ display_name: displayName })
          .eq("user_id", remote.userId);
      }

      return nextState;
    });
  }, []);

  const resetPortfolio = useCallback(() => {
    setState((current) => {
      const nextState = {
        ...current,
        cash: current.startingCash,
        holdings: [],
      };

      persistLocal(nextState);
      setMessage("Danh mục ảo đã được đặt lại. Lịch sử giao dịch cũ vẫn được giữ.");

      const supabase = createSupabaseBrowserClient();
      const remote = remoteRef.current;

      if (supabase && remote) {
        void Promise.all([
          supabase
            .from("portfolios")
            .update({ current_cash: nextState.cash })
            .eq("id", remote.portfolioId)
            .eq("user_id", remote.userId),
          supabase
            .from("profiles")
            .update({ current_cash: nextState.cash })
            .eq("user_id", remote.userId),
          supabase
            .from("holdings")
            .delete()
            .eq("user_id", remote.userId)
            .eq("portfolio_id", remote.portfolioId),
        ]);
      }

      return nextState;
    });
  }, []);

  return {
    state,
    summary,
    loading,
    message,
    setMessage,
    buyStock,
    sellStock,
    updateJournal,
    updateMissionProgress,
    updateDisplayName,
    resetPortfolio,
  };
}
