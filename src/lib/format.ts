export function formatPoints(value: number) {
  return `${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value))} điểm ảo`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(value)}%`;
}

export function formatDate(value?: string) {
  if (!value) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDifficulty(value: string) {
  const labels: Record<string, string> = {
    beginner: "Nhập môn",
    intermediate: "Trung cấp",
    advanced: "Nâng cao",
  };

  return labels[value] ?? value;
}

export function formatEmotion(value: string) {
  const labels: Record<string, string> = {
    calm: "Bình tĩnh",
    curious: "Tò mò",
    FOMO: "Sợ bỏ lỡ",
    confident: "Tự tin",
    uncertain: "Chưa chắc chắn",
  };

  return labels[value] ?? value;
}

export function formatTradeSide(value: string) {
  const labels: Record<string, string> = {
    buy: "Mua",
    sell: "Bán",
  };

  return labels[value] ?? value;
}

export function formatMissionStatus(value: string) {
  const labels: Record<string, string> = {
    not_started: "Chưa bắt đầu",
    in_progress: "Đang làm",
    completed: "Hoàn thành",
  };

  return labels[value] ?? value;
}

export function formatMistakeType(value: string) {
  const labels: Record<string, string> = {
    FOMO: "Sợ bỏ lỡ",
    "Over-concentration": "Tập trung quá mức",
    "No thesis": "Thiếu luận điểm",
    "Panic selling": "Bán vì hoảng sợ",
    "Chasing news": "Chạy theo tin tức",
    "Ignoring risk": "Bỏ qua rủi ro",
    "Good discipline": "Kỷ luật tốt",
    Other: "Khác",
  };

  return labels[value] ?? value;
}
