package com.dental_clinic.patient_service.DTO.Request;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record UpdateLastVisted(
        @NotNull(message = "Id không được để trống")
        String id,
        @NotNull(message = "Thời gian không được để trống")
        @PastOrPresent(message = "Thời gian không hợp lệ")
        LocalDateTime last_visit
) {
}
