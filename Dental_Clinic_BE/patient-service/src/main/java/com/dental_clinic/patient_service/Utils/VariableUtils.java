package com.dental_clinic.patient_service.Utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class VariableUtils {
    public static final String DEFAULT_PATIENT_SERVICE = "template/blank_patient.png";
    public static final String IMAGE_NA = "template/image_state_not_available.jpg";

    public static final String UPLOAD_DIR_ROOT = "../patient-service/uploads";
    public static final String UPLOAD_DIR_PATIENT_SERVICE = "../patient-service/uploads/patient_services";
    public static final String UPLOAD_DIR_PATIENT_SERVICE_POSTFIX = "patient_services/";

    public static final int TYPE_UPLOAD_PATIENT_SERVICE = 1;
    public static final String TYPE_UPLOAD_PATIENT_SERVICE_PATH = "patient_services";

    public static final DateTimeFormatter FORMATTER_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter FORMATTER_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static final String PATIENT_SERVICE_NAME = "patient-service";

    public static String getStringFromUploadType(int uploadType) {
        return switch (uploadType) {
            case TYPE_UPLOAD_PATIENT_SERVICE -> TYPE_UPLOAD_PATIENT_SERVICE_PATH;
            default -> "";
        };
    }

    public static String convertToVnTimeZoneString(LocalDateTime localDateTime) {
        // Chuyển LocalDateTime sang ZonedDateTime với múi giờ cụ thể
        ZonedDateTime zonedCreatedAt = localDateTime.atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
        // Định dạng thời gian thành chuỗi mong muốn
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return zonedCreatedAt.format(formatter);
    }

    public static String getServerScanPrefix() {
        return LocalDateTime.now() + " SERVER SCAN --- ";
    }

    public static String getServerStatPrefix() {
        return LocalDateTime.now() + " SERVER STAT --- ";
    }
}