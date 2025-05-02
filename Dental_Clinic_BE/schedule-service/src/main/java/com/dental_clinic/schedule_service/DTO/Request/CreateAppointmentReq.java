package com.dental_clinic.schedule_service.DTO.Request;

import jakarta.validation.constraints.*;

import java.time.LocalDateTime;

public record CreateAppointmentReq(
        @NotNull( message = "Mã nha sĩ không được để trống" )
        Long denId ,

        @NotNull( message = "Mã bệnh nhân không được để trống" )
        String patId ,

        @NotNull( message = "Mã trợ lý không được để trống" )
        Long assiId ,

        @NotNull( message = "Thời gian bắt đầu không được để trống" )
        @FutureOrPresent ( message = "Thời gian bắt đầu phải là thời gian hiện tại hoặc trong tương lai" )
        LocalDateTime timeStart ,

        @NotNull( message = "Thời gian kết thúc không được để trống" )
        @FutureOrPresent ( message = "Thời gian kết thúc phải là thời gian hiện tại hoặc trong tương lai" )
        LocalDateTime timeEnd ,

        @Size( max = 255, message = "Triệu chứng không được vượt quá 255 ký tự" )
        String symptom ,

        @Size( max = 255, message = "Ghi chú không được vượt quá 255 ký tự" )
        String note
) {
}
