package com.dental_clinic.schedule_service.Utils;

public class AppointmentUtils {
    public static String mapFieldName(String fieldName) {
        // Ánh xạ tên trường logic sang tên thực tế trong MongoDB
        switch (fieldName) {
            case "denId":
                return "den_id";
            case "patId":
                return "pat_id";
            case "assiId":
                return "assi_id";
            case "startTime":
                return "time_start";
            case "endTime":
                return "time_end";
            default:
                return fieldName; // Trả về tên gốc nếu không cần ánh xạ
        }
    }
}
