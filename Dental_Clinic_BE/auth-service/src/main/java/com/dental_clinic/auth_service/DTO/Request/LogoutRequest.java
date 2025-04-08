package com.dental_clinic.auth_service.DTO.Request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {
    @NotEmpty(message = "Email  không được để trống")
    private String email;
}
