package com.dental_clinic.prescription_service.DTO.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record MedicineReq(
        @NotNull(message = "Mã thuốc không được để trống")
        @Min(value = 1, message = "Mã thuốc phải lớn hơn 0")
        Long med_id,

        @NotNull(message = "Số lượng thuốc không được để trống")
        @Min(value = 1, message = "Số lượng thuốc phải lớn hơn 0")
        Integer quantity_medicine
) {
}
