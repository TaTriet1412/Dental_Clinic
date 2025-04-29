package com.dental_clinic.schedule_service.DTO.Request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ScheduleRangeTimeReq(
        @NotNull (message = "Mã người dùng không được để trống")
        Long userId,
        @NotNull (message = "Thời gian bắt đầu không được để trống")
        LocalDateTime startTime,
        @NotNull (message = "Thời gian kết thúc không được để trống")
        LocalDateTime endTime
) {
}
