package com.dental_clinic.schedule_service.Entity;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Document(collection="work_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkSchedule {
    @Id
    private String id;
    @NotNull(message = "Mã người dùng không được để trống")
    @Field(name = "user_id")
    private Long userId;
    @NotNull(message = "Thời gian bắt đầu không được để trống")
    @Field("time_start")
    private LocalDateTime timeStart;
    @NotNull(message = "Thời gian kết thúc không được để trống")
    @Field("time_end")
    private LocalDateTime timeEnd;
}
