import type { Mission } from "@/data/sample-content";
import type { Stock } from "@/lib/market-data/types";

export type TradeSide = "buy" | "sell";

export type TradeEmotion = "calm" | "curious" | "FOMO" | "confident" | "uncertain";

export type ReviewInterval = 7 | 14 | 30;

export type ThesisStatus = "valid" | "weakened" | "invalid" | "unsure";

export type WouldRepeat = "yes" | "no" | "unsure";

export type MistakeType =
  | "FOMO"
  | "Over-concentration"
  | "No thesis"
  | "Panic selling"
  | "Chasing news"
  | "Ignoring risk"
  | "Good discipline"
  | "Other";

export type Holding = {
  ticker: string;
  stockId?: string;
  quantity: number;
  averagePrice: number;
  createdAt: string;
  updatedAt: string;
};

export type Trade = {
  id: string;
  stockId?: string;
  ticker: string;
  side: TradeSide;
  quantity: number;
  price: number;
  grossValue: number;
  fee: number;
  netValue: number;
  thesis: string;
  expectedHoldingPeriod: string;
  riskNote: string;
  emotion: TradeEmotion;
  reviewAfterDays: ReviewInterval;
  reviewDueAt: string;
  createdAt: string;
};

export type JournalEntry = {
  tradeId: string;
  reflection: string;
  lessonLearned: string;
  mistakeType: MistakeType;
  confidenceScore: number;
  thesisStatus: ThesisStatus;
  wouldRepeat: WouldRepeat;
  reviewedAt: string;
  updatedAt: string;
};

export type MissionProgress = {
  missionSlug: string;
  missionId?: string;
  status: "not_started" | "in_progress" | "completed";
  startedAt?: string;
  completedAt?: string;
  notes: string;
};

export type PortfolioState = {
  displayName: string;
  startingCash: number;
  cash: number;
  stocks: Stock[];
  holdings: Holding[];
  trades: Trade[];
  journal: JournalEntry[];
  missionProgress: MissionProgress[];
  missions: Mission[];
  source: "demo" | "supabase" | "vnstock";
};

export type TradeInput = {
  ticker: string;
  quantity: number;
  thesis: string;
  expectedHoldingPeriod: string;
  riskNote: string;
  emotion: TradeEmotion;
  reviewAfterDays: ReviewInterval;
};
