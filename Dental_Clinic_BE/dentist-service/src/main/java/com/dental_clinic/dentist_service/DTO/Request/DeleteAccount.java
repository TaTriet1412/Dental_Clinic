package com.dental_clinic.dentist_service.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Valid
public record DeleteAccount(
        @NotNull(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email
) {
}
