package com.dental_clinic.payment_service.DTO.Request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ServicesReq(
        @NotNull (message = "Mã dịch vụ không được null")
        String serviceId,
        @NotNull (message = "Số lượng dịch vụ không được null")
        @Positive (message = "Số lượng dịch vụ phải lớn hơn 0")
        Integer quantityService
) {
}
