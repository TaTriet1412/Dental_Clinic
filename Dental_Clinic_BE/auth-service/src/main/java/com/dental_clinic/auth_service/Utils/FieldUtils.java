package com.dental_clinic.auth_service.Utils;

public class FieldUtils {
    public static boolean isValidEmail(String email) {
        return email != null && VariableUtils.EMAIL_PATTERN.matcher(email).matches();
    }
}
