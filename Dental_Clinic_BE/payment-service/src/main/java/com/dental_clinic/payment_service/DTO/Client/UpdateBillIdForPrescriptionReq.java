package com.dental_clinic.payment_service.DTO.Client;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record UpdateBillIdForPrescriptionReq(
        @NotNull(message = "Mã hóa đơn không được để trống")
        @Min(value = 1, message = "Mã hóa đơn phải lớn hơn 0")

        Long bill_id
) {
}
