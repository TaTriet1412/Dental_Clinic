package com.dental_clinic.schedule_service.Entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection="work_schedules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Work_Schedule {
    @Id
    private String id;
    private LocalDateTime start_time;
}
