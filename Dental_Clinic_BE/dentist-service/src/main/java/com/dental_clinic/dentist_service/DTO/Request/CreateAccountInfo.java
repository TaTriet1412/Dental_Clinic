package com.dental_clinic.dentist_service.DTO.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;

public record CreateAccountInfo(
        @NotNull(message = "Email không được null")
        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotNull(message = "roleId không được null")
        Long roleId,

        @NotNull(message = "Tên không được null")
        @NotBlank(message = "Tên không được để trống")
        String name,

        @NotNull(message = "Địa chỉ không được null")
        @NotBlank(message = "Địa chỉ không được để trống")
        String address,

        @JsonProperty("birthday")
        @NotNull(message = "Ngày sinh không được null")
        LocalDate birthDate,

        @NotNull(message = "Số điện thoại không được null")
        @NotBlank(message = "Số điện thoại không được để trống")
        String phone,

        @NotNull(message = "Lương không được null")
        @PositiveOrZero(message = "Lương không thể âm")
        Integer salary,

        @NotNull(message = "Giới tính không được null")
        Boolean gender
) {
}