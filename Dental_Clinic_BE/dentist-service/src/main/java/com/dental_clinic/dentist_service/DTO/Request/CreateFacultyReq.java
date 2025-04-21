package com.dental_clinic.dentist_service.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateFacultyReq(
        @NotNull(message = "Tên khoa không được null")
        @NotBlank(message = "Tên khoa không được để trống")
        String name,

        @NotNull(message = "Mô tả không được null")
        @NotBlank(message = "Mô tả không được để trống")
        String description,

        @NotNull(message = "Email không được null")
        @NotBlank(message = "Email không được để trống")
        String email,

        @NotNull(message = "Số điện thoại không được null")
        @NotBlank(message = "Số điện thoại không được để trống")
        String phoneNumber

) {
}
