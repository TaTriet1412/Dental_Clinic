package com.dental_clinic.dentist_service.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record CreateDentistReq(
        @NotNull(message = "Mã Khoa không được null hay để trống!")
        @PositiveOrZero(message = "Mã khoa không thể âm")
        Long facId,

        @NotNull(message = "Nhập thiếu chuyên môn")
        @NotBlank(message = "Chuyên môn không được rỗng")
        String specialty,

        @NotNull(message = "Nhập thiếu năm kinh nghiệm")
        @PositiveOrZero(message = "Năm kinh nghiệm không thể âm")
        Integer expYear,

        @Valid
        @NotNull(message = "Tài khoản không được null hay để trống!")
        CreateAccountInfo account
) {
}