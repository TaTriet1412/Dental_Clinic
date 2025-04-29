package com.dental_clinic.schedule_service.DTO.Request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Optional;

public record UpdateAppointStatusReq(
        @NotNull (message = "Mã lịch hẹn không được để trống")
        String appointment_id,
        @NotNull (message = "Trạng thái không được để trống")
        @NotBlank (message = "Trạng thái không được để trống")
        String status,
        Optional<String> note
) {
}
