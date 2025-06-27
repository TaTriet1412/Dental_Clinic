export const STATUS_TRANSLATION: Record<string, string> = {
    confirmed: 'Đã xác nhận',
    in_progress: 'Đang diễn ra',
    finished: 'Hoàn thành',
    not_show: 'Không đến',
    cancelled: 'Đã huỷ',
};

export function translateStatus(code: string): string {
  return STATUS_TRANSLATION[code] || "Chưa xác định";
}
