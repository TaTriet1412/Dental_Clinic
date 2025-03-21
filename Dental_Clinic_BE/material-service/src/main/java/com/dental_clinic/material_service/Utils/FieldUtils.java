package com.dental_clinic.material_service.Utils;


import java.time.LocalDate;
import java.util.List;

public class FieldUtils {
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

    public static void checkListEmpty(List<?> list, String nameList) {
        if(list.isEmpty())
            throw new RuntimeException("Mảng '" + nameList + "' phải có ít nhất 1 phần tử");
    }

    public static boolean isLocalDateMoreThanToday(LocalDate currDate) {
        return currDate.isAfter(LocalDate.now());
    }
}
