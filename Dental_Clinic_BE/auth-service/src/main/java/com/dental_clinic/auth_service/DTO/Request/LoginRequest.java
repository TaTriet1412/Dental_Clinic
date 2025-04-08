package com.dental_clinic.auth_service.DTO.Request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotEmpty(message = "Email hoặc số điện thoại không được để trống")
    private String userId;


    @NotEmpty(message = "Mật khẩu không được để trống")
    private String password;
}