package com.dental_clinic.schedule_service.Entity;

public enum AppointmentStatus {
    confirmed,    // Đã xác nhận
    cancelled,    // Đã hủy
    not_show,     // Không đến
    finished,    // Đã hoàn tất
    in_progress;  // Đang diễn ra

    public static String translateStatus(String status) {
        if (status == null) {
            return null;
        }
        return switch (status.toLowerCase()) {
            case "in_progress" -> "Đang diễn ra";
            case "confirmed" -> "Đã xác nhận";
            case "cancelled" -> "Đã hủy";
            case "finished" -> "Đã hoàn thành";
            case "not_show" -> "Không đến";
            default -> status;
        };
    }
}
