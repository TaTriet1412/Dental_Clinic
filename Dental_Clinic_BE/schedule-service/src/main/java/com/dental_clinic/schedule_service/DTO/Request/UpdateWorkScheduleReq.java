package com.dental_clinic.schedule_service.DTO.Request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record UpdateWorkScheduleReq(
        @NotNull(message = "Mã lịch làm việc không được để trống")
        String id,
        @NotNull(message = "Thời gian bắt đầu không được để trống")
        @FutureOrPresent(message = "Thời gian bắt đầu phải là thời gian hiện tại hoặc trong tương lai")
        LocalDateTime startTime ,
        @NotNull(message = "Thời gian kết thúc không được để trống")
        @FutureOrPresent(message = "Thời gian kết thúc phải là thời gian hiện tại hoặc trong tương lai")
        LocalDateTime endTime
) {
}
