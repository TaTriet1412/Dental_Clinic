package com.dental_clinic.prescription_service.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;

public record UpdatePrescriptionReq(
        @NotNull(message = "Mã toa thuốc không được để trống")
        String id,
        Optional<String> note,
        @NotNull(message = "Mã nha sĩ không được để trống")
        Long den_id,
        @NotNull(message = "Tên nha sĩ không được để trống")
        String den_name,
        Optional<String> pat_id,
        @Valid
        Optional<List<MedicineReq>> medicines
) {
}
