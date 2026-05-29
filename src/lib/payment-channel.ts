const BANK_LABELS: Record<string, string> = {
  bca: "BCA",
  bni: "BNI",
  bri: "BRI",
  mandiri: "Mandiri",
  permata: "Permata",
  cimb: "CIMB Niaga",
  maybank: "Maybank",
  mega: "Bank Mega",
};

const CHANNEL_LABELS: Record<string, string> = {
  midtrans: "Midtrans",
  gopay: "GoPay",
  shopeepay: "ShopeePay",
  dana: "DANA",
  ovo: "OVO",
  akulaku: "Akulaku",
  kredivo: "Kredivo",
  cstore: "Convenience Store",
  alfamart: "Alfamart",
  indomaret: "Indomaret",
  qris: "QRIS",
  credit_card: "Kartu Kredit",
  bank_transfer: "Bank Transfer",
  echannel: "Mandiri Bill Payment",
  permata: "Permata Virtual Account",
};

const titleize = (value: string) =>
  value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const bankLabel = (value: string) =>
  BANK_LABELS[value.toLowerCase()] || titleize(value);

export function formatPaymentChannel(paymentMethod?: string | null) {
  const raw = paymentMethod?.trim();
  if (!raw) return "Midtrans";

  const [typeRaw, detailRaw] = raw.toLowerCase().split(":");
  const type = typeRaw || "midtrans";
  const detail = detailRaw || "";

  if (type === "midtrans") return "Midtrans";
  if (type === "bank_transfer") {
    const channel = detail
      ? `${bankLabel(detail)} Virtual Account`
      : "Bank Transfer";
    return `Midtrans - ${channel}`;
  }
  if (type === "credit_card") {
    const channel = detail ? `Kartu Kredit ${bankLabel(detail)}` : "Kartu Kredit";
    return `Midtrans - ${channel}`;
  }
  if (type === "qris") {
    const channel = detail ? `QRIS ${titleize(detail)}` : "QRIS";
    return `Midtrans - ${channel}`;
  }
  if (type === "cstore") {
    const channel = detail ? titleize(detail) : "Convenience Store";
    return `Midtrans - ${channel}`;
  }

  return `Midtrans - ${CHANNEL_LABELS[type] || titleize(type)}`;
}
