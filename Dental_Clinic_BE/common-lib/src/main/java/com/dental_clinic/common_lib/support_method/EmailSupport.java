package com.dental_clinic.common_lib.support_method;

public class EmailSupport {
    private static final String EMAIL_REGEX_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";

    public static boolean isEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return false;
        }
        return email.matches(EMAIL_REGEX_PATTERN);
    }
}
