import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

/**
 * Format a date string or object to local date format for Asia/Jakarta timezone.
 */
export function formatDate(dateInput?: string | Date | number | null) {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta"
    });
  } catch {
    return "-";
  }
}

/**
 * Format a date string or object to local date & time format for Asia/Jakarta timezone.
 */
export function formatDateTime(dateInput?: string | Date | number | null) {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Jakarta"
    });
  } catch {
    return "-";
  }
}

/**
 * Format date to Indonesian long format with time and WIB (e.g. 20 Oktober 2025 - 21:13 WIB)
 */
export function formatInvoiceDateTime(dateInput?: string | Date | number | null) {
  if (!dateInput) return "-";
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return "-";
    
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    
    return `${day} ${month} ${year} - ${hours}:${minutes} WIB`;
  } catch {
    return "-";
  }
}

