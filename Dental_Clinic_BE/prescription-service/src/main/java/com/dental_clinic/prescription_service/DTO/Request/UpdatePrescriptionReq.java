package com.dental_clinic.prescription_service.DTO.Request;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Optional;

public record UpdatePrescriptionReq(
        @NotNull(message = "Mã toa thuốc không được để trống")
        String id,
        Optional<String> note,
        Optional<Long> den_id,
        Optional<String> pat_id,
        Optional<List<MedicineReq>> medicines
) {
}
