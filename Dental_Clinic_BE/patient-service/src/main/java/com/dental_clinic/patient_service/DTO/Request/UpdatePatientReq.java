package com.dental_clinic.patient_service.DTO.Request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.Optional;

public record UpdatePatientReq(
        @NotBlank(message = "Id không được để trống")
        String id,
        Optional<String> name,
        Optional<Boolean> gender,
        Optional<String> phone,
        Optional<String> address,
        Optional<String> email,
        Optional<LocalDate> birthday
) {
}
