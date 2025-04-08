package com.dental_clinic.auth_service.Utils;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.regex.Pattern;

public class VariableUtils {
    public static final String DEFAULT_PASSWORD = "123";
    public static final Long DEFAULT_ADMIN_ID = 1L;

    public static final String DEFAULT_AVATAR = "template/blank_user.png";

    public static final String EMAIL_REGEX = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$";
    public static final Pattern EMAIL_PATTERN = Pattern.compile(EMAIL_REGEX);

    public static final String DEFAULT_USER = "template/blank_user.png";

    public static final String UPLOAD_DIR_ROOT = "../auth-service/uploads";
    public static final String UPLOAD_DIR_AUTH_SERVICE = "../auth-service/uploads/auth_services/";
    public static final String UPLOAD_DIR_AUTH_SERVICE_POSTFIX = "auth_services/";

    public static final int TYPE_UPLOAD_AUTH_SERVICE = 1;
    public static final String TYPE_UPLOAD_AUTH_SERVICE_PATH = "auth_services";

    public static final DateTimeFormatter FORMATTER_DATE_TIME = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    public static final DateTimeFormatter FORMATTER_DATE = DateTimeFormatter.ofPattern("yyyy-MM-dd");


    public static String getStringFromUploadType(int uploadType) {
        return switch (uploadType) {
            case TYPE_UPLOAD_AUTH_SERVICE -> TYPE_UPLOAD_AUTH_SERVICE_PATH;
            default -> "";
        };
    }


    public static String getServerScanPrefix() {
        return LocalDateTime.now() + " SERVER SCAN --- ";
    }

    public static String getServerStatPrefix() {
        return LocalDateTime.now() + " SERVER STAT --- ";
    }
}
