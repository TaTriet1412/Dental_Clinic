package com.dental_clinic.auth_service.DTO.Request;

import jakarta.validation.constraints.Email;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

@Valid
public record DeleteAccount(
        @NotNull(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email
) {
}
