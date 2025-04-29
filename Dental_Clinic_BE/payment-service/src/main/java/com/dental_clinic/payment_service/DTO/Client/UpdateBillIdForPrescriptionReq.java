package com.dental_clinic.prescription_service.DTO.Request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateBillIdForPrescriptionReq(
        @NotNull(message = "Mã hóa đơn không được để trống")
        @Min(value = 1, message = "Mã hóa đơn phải lớn hơn 0")

        Long bill_id
) {
}
