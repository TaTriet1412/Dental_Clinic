package com.dental_clinic.dental_service.Utils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

public class VariableUtils {
    public static final String DEFAULT_DENTAL_SERVICE = "template/blank_service.png";
    public static final String IMAGE_NA = "template/image_state_not_available.jpg";

    // Thay đổi đường dẫn cho container
    public static final String UPLOAD_DIR_ROOT = getUploadRoot();
    public static final String UPLOAD_DIR_DENTAL_SERVICE = UPLOAD_DIR_ROOT + "/dental_services";
    public static final String UPLOAD_DIR_DENTAL_SERVICE_POSTFIX = "dental_services/";

    public static final int TYPE_UPLOAD_DENTAL_SERVICE = 1;
    public static final String TYPE_UPLOAD_DENTAL_SERVICE_PATH = "dental_services";

    public static final DateTimeFormatter FORMATTER_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter FORMATTER_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public static final String DENTAL_SERVICE_NAME = "dental-service";

    public static String getStringFromUploadType(int uploadType) {
        return switch (uploadType) {
            case TYPE_UPLOAD_DENTAL_SERVICE -> TYPE_UPLOAD_DENTAL_SERVICE_PATH;
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

    private static String getUploadRoot() {
        // Kiểm tra nếu đang chạy trong Docker (có thể dùng environment variable)
        String dockerEnv = System.getProperty("RUNNING_IN_DOCKER");
        if ("true".equals(dockerEnv) || System.getenv("SPRING_PROFILES_ACTIVE") != null &&
            System.getenv("SPRING_PROFILES_ACTIVE").contains("docker")) {
            return "/app/uploads";
        }
        // Đường dẫn cho development
        return "../dental-service/uploads";
    }
}