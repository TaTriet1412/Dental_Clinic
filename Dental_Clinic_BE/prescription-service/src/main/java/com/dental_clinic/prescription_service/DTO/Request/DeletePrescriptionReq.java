package com.dental_clinic.prescription_service.DTO.Request;

import jakarta.validation.constraints.NotNull;

public record DeletePrescriptionReq(
        @NotNull(message = "Id người thay đổi không được để trống")
        Long userId,
        @NotNull (message = "Tên nguời thay đổi không được để trống")
        String actorName
) {
}
