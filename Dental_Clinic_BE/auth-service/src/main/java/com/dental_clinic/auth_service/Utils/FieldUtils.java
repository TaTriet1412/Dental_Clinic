package com.dental_clinic.auth_service.Utils;

public class FieldUtils {
    public static boolean isValidEmail(String email) {
        return email != null && VariableUtils.EMAIL_PATTERN.matcher(email).matches();
    }

    public static void checkFieldIsEmptyOrNull(Object object,String message) {
        if(object == null)
            throw new RuntimeException(message + " không được để trống");
        if(object instanceof String && ((String) object).isBlank())
            throw new RuntimeException(message + " không được là chuỗi rỗng");
    }

    public static void checkStrEmpty(String str,String message) {
        if(str.isBlank())
            throw new RuntimeException(message + " không được là chuỗi rỗng");
    }

    public static void checkNumberIsIntegerAndNotNegative(Object object) {
        if(!(object instanceof Integer))
            throw new RuntimeException("Định dạng phải là số nguyên!");
        if((Integer) object <0)
            throw new RuntimeException("Số không được âm");
    }
}
