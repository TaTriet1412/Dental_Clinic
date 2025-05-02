package com.dental_clinic.schedule_service.Entity;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection="appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @NotNull(message = "ID không được để trống")
    private String id;

    @NotNull(message = "Mã nha sĩ không được để trống")
    @Field ("den_id")
    private Long denId;

    @NotNull(message = "Mã bệnh nhân không được để trống")
    @Field ("pat_id")
    private String patId;

    @NotNull(message = "Mã phụ tá không được để trống")
    @Field ("assi_id")
    private Long assiId;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    @Field ("time_start")
    private LocalDateTime timeStart;

    @Field ("time_end")
    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime timeEnd;

    @Size(max = 255, message = "Triệu chứng không được vượt quá 255 ký tự")
    private String symptom;

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String note;

    @Field("created_at")
    @PastOrPresent(message = "Thời gian tạo phải là thời gian hiện tại hoặc trong quá khứ")
    private LocalDateTime createdAt;

    @NotNull(message = "Trạng thái không được để trống")
    @Size(max = 50, message = "Trạng thái không được vượt quá 50 ký tự")
    @Field("status") // để giữ tên field trong MongoDB là "status"
    private AppointmentStatus status;
}
