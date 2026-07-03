import type {
  MarketDataStatus,
  MarketDirection,
  MarketSummary,
} from "./summary";

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
  const parts = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Ho_Chi_Minh",
  })
    .formatToParts(new Date(value))
    .reduce<Record<string, string>>((result, part) => {
      if (part.type !== "literal") {
        result[part.type] = part.value;
      }
      return result;
    }, {});

  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}

export function marketStatusLabel(status: MarketDataStatus) {
  if (status === "delayed") {
    return "Dữ liệu có thể trễ";
  }

  if (status === "failed") {
    return "Nguồn lỗi · dữ liệu minh họa";
  }

  return "Dữ liệu minh họa";
}

export function marketTimestampLabel(summary: MarketSummary) {
  const prefix = summary.status === "delayed" ? "Tải lúc" : "Mốc dữ liệu";
  return `${prefix} ${formatMarketUpdatedAt(summary.updatedAt)}`;
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
