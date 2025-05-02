
package com.dental_clinic.auth_service.DTO.Request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreateAccountInfo(
        @NotNull(message = "Email không được để trống")
        @NotEmpty(message = "Email không được để trống")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotNull(message = "Vai trò không được để trống")
        Long roleId,

        @NotEmpty(message = "Tên không được để trống")
        @Size(min = 2, max = 50, message = "Tên phải từ 2-50 ký tự")
        String name,

        @NotEmpty(message = "Địa chỉ không được để trống")
        String address,

        @JsonProperty("birthday")
        @PastOrPresent(message = "Ngày sinh không được là tương lai")
        LocalDate birthDate,

        @Pattern(regexp = "^(\\+84|0)\\d{9,10}$", message = "Số điện thoại không hợp lệ")
        String phone,

        @NotNull(message = "Lương không được để trống")
        @Min(value = 100000, message = "Lương không được nhỏ hơn 100.000 đồng")
        Integer salary,

        Boolean gender
) {}