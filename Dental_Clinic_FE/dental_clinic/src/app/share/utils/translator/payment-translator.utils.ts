export const STATUS_TRANSLATION: Record<string, string> = {
  paid: 'Đã thanh toán',
  confirmed: 'Đang xử lý',
  cancelled: 'Đã huỷ',
};

export function translateStatus(code: string): string {
  return STATUS_TRANSLATION[code] || "Chưa xác định";
}
