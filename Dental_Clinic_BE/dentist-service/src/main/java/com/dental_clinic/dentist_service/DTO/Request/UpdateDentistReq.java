package com.dental_clinic.dentist_service.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.Optional;

public record UpdateDentistReq(
        @NotNull(message = "Nhập thiếu mã nha sĩ")
        @PositiveOrZero(message = "Mã nha sĩ không thể âm")
        Long dentistId,

        Optional<String> specialty,
        Optional<Integer> expYear,
        Optional<Long> facId
) {
}
