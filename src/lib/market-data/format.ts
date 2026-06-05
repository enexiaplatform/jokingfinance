import type { MarketDirection } from "./summary";

export function formatMarketNumber(value: number, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits,
  }).format(value);
}

export function formatMarketChange(value: number, maximumFractionDigits = 0) {
  const sign = value > 0 ? "+" : "";

  return `${sign}${formatMarketNumber(value, maximumFractionDigits)}`;
}

export function formatMarketPercent(value: number) {
  return `${formatMarketChange(value, 2)}%`;
}

export function marketArrow(direction: MarketDirection) {
  if (direction === "up") {
    return "▲";
  }

  if (direction === "down") {
    return "▼";
  }

  return "■";
}

export function formatMarketUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(value));
}

export function formatTodayLabel() {
  return new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
}
