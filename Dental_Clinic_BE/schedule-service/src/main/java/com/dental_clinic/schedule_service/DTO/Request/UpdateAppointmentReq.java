package com.dental_clinic.schedule_service.DTO.Request;

import com.dental_clinic.schedule_service.Entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.Optional;

public record UpdateAppointmentReq(
        @NotNull ( message = "Mã lịch hẹn không được để trống" )
        String id,

        Optional<Long> denId ,
        Optional<String> patId ,
        Optional<Long> assiId ,
        Optional<LocalDateTime> timeStart ,
        Optional<LocalDateTime> timeEnd ,
        Optional<String> symptom ,
        Optional<String> note
) {

}
