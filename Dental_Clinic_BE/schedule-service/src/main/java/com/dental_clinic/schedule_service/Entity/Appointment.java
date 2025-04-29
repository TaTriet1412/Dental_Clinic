package com.dental_clinic.schedule_service.Entity;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection="appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appoinment {
    @NotNull(message = "ID không được để trống")
    private String id;

    @NotNull(message = "Mã nha sĩ không được để trống")
    private Long denId;

    @NotNull(message = "Mã bệnh nhân không được để trống")
    private Long patId;

    @NotNull(message = "Mã trợ lý không được để trống")
    private Long assiId;

    @NotNull(message = "Thời gian bắt đầu không được để trống")
    private LocalDateTime timeStart;

    @NotNull(message = "Thời gian kết thúc không được để trống")
    private LocalDateTime timeEnd;

    @Size(max = 255, message = "Triệu chứng không được vượt quá 255 ký tự")
    private String symptom;

    @Size(max = 255, message = "Ghi chú không được vượt quá 255 ký tự")
    private String note;

    @PastOrPresent(message = "Thời gian tạo phải là thời gian hiện tại hoặc trong quá khứ")
    private LocalDateTime createdAt;

    @NotNull(message = "Trạng thái không được để trống")
    @Size(max = 50, message = "Trạng thái không được vượt quá 50 ký tự")
    private String status;
}
