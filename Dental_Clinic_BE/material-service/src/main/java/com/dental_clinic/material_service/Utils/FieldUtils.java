package com.dental_clinic.material_service.Utils;


import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;

import java.time.LocalDate;
import java.util.List;

public class FieldUtils {
    public static void checkFieldIsEmptyOrNull(Object object,String message) {
        if(object == null)
            throw new AppException(ErrorCode.INVALID_REQUEST,message + " không được để trống");
        if(object instanceof String && ((String) object).isBlank())
            throw new AppException(ErrorCode.INVALID_REQUEST,message + " không được là chuỗi rỗng");
    }

    public static void checkStrEmpty(String str,String message) {
        if(str.isBlank())
            throw new AppException(ErrorCode.INVALID_REQUEST,message + " không được là chuỗi rỗng");
    }

    public static void checkNumberIsIntegerAndNotNegative(Object object) {
        if(!(object instanceof Integer))
            throw new AppException(ErrorCode.INVALID_REQUEST,"Định dạng phải là số nguyên!");
        if((Integer) object <0)
            throw new AppException(ErrorCode.INVALID_REQUEST,"Số không được âm");
    }

    public static void checkListEmpty(List<?> list, String nameList) {
        if(list.isEmpty())
            throw new AppException(ErrorCode.INVALID_REQUEST,"Mảng '" + nameList + "' phải có ít nhất 1 phần tử");
    }

    public static boolean isLocalDateMoreThanToday(LocalDate currDate) {
        return currDate.isAfter(LocalDate.now());
    }
}
