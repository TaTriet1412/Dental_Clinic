package com.dental_clinic.payment_service.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreateBillReq(
        @NotBlank(message = "Mã bệnh nhân không được để trống")
        @NotNull (message = "Mã bệnh nhân không được null")
        String patientId,

        @NotBlank(message = "Mã đơn thuốc không được để trống")
        @NotNull (message = "Mã đơn thuốc không được null")
        String prescriptionId,

        @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
        String note,

        @NotNull (message = "Dịch vụ không được null")
        @NotEmpty(message = "Dịch vụ không được để trống")
        @Valid
        List<ServicesReq> services
) {
}