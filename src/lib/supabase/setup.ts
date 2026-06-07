export const SUPABASE_PROJECT_URL = "https://ygqrrdlbpblqqlobpbay.supabase.co";

export const SUPABASE_AUTH_CALLBACK_PATH = "/auth/callback";

export const SUPABASE_SYNC_TABLES = [
  "profiles",
  "portfolios",
  "holdings",
  "trades",
  "trade_journal",
  "user_mission_progress",
  "user_knowledge_progress",
] as const;

export const SUPABASE_REQUIRED_MIGRATIONS = [
  "20260604130000_jokingfinance_mvp_schema.sql",
  "20260605125527_add_user_knowledge_progress.sql",
] as const;
