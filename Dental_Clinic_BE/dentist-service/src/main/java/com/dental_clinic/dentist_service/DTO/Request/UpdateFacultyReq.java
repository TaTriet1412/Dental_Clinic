package com.dental_clinic.dentist_service.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.Optional;

public record UpdateFacultyReq(
        @NotNull(message = "Mã khoa không được null")
        @PositiveOrZero(message = "Mã khoa không thể âm")
        Long facultyId,

        Optional<String> name,
        Optional<String> description,
        Optional<String> email,
        Optional<String> phoneNumber
) {
}
