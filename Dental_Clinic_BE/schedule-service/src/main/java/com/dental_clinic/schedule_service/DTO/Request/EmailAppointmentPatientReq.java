package com.dental_clinic.schedule_service.DTO.Request;

import com.dental_clinic.schedule_service.Entity.AppointmentStatus;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record EmailAppointmentPatientReq(
        String email,
        String appointmentId,
        LocalDateTime timeStart,
        LocalDateTime timeEnd,
        String dentistName,
        String assistantName,
        String patientName,
        String patientId,
        String symptoms,
        String note,
        AppointmentStatus status
) {
}
