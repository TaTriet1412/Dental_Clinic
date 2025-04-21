package com.dental_clinic.prescription_service.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record CreatePrescriptionReq(
        @NotNull(message = "Mã bệnh nhân không được để trống")
        @Min(value = 1, message = "Mã bệnh nhân phải lớn hơn 0")
        Long pat_id,

        @NotNull(message = "Mã nha sĩ không được để trống")
        @Min(value = 1, message = "Mã nha sĩ phải lớn hơn 0")
        Long den_id,

        @NotBlank(message = "Ghi chú không được để trống")
        @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự")
        String note,

        @NotEmpty(message = "Danh sách thuốc không được để trống")
        @Valid
        List<MedicineReq> medicines
) {
}
