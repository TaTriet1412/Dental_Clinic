package com.dental_clinic.auth_service.DTO.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.Optional;

public record UpdateAccount(
        @NotNull(message = "Mã user không được để trống")
        Long userId,
        Optional<String> email,
        Optional<String> name,
        Optional<String> address,
        Optional<LocalDate> birthday,
        Optional<String> phone,
        Optional<Boolean> gender,
        Optional<Integer> salary
) {
}