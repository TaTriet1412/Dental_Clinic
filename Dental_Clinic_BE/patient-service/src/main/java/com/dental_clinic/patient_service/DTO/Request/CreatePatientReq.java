package com.dental_clinic.patient_service.DTO.Request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record CreatePatientReq(
        @NotBlank(message = "Tên bệnh nhân không được để trống")
        @Size(max = 100, message = "Tên bệnh nhân không được vượt quá 100 ký tự")
        String name,

        @NotNull(message = "Giới tính không được để trống")
        Boolean gender,

        @NotNull(message = "Ngày sinh không được để trống")
        @Past(message = "Ngày sinh phải là ngày trong quá khứ")
        LocalDate birthday,

        @NotBlank(message = "Số điện thoại không được để trống")
        String phone,

        @NotBlank(message = "Địa chỉ không được để trống")
        @Size(max = 200, message = "Địa chỉ không được vượt quá 200 ký tự")
        String address,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        @Size(max = 100, message = "Email không được vượt quá 100 ký tự")
        String email
)  {
}
