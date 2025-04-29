package com.dental_clinic.schedule_service.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class EventRes {
    private String id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
