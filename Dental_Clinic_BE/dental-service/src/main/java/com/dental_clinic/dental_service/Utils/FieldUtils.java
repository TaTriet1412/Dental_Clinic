package com.dental_clinic.dental_service.Utils;

import org.bson.types.ObjectId;

public class FieldUtils {
    public static void checkFieldIsEmptyOrNull(Object object,String message) {
        if(object == null)
            throw new RuntimeException(message + " không được để trống");
        if(object instanceof String && ((String) object).isEmpty())
            throw new RuntimeException(message + " không được là chuỗi rỗng");
    }

    public static void checkNumberIsIntegerAndNotNegative(Object object) {
        if(!(object instanceof Integer))
            throw new RuntimeException("Định dạng phải là số nguyên!");
        if((Integer) object <0)
            throw new RuntimeException("Số không được âm");
    }

    public static void checkObjectId(String id) {
        // Xác thực đúng định dạng ObjectId không
        if (!ObjectId.isValid(id)) {
            throw new IllegalArgumentException("Sai định dạng ObjectId: " + id);
        }

    }
}
