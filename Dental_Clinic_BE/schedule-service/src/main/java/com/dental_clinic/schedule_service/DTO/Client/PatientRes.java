package com.dental_clinic.schedule_service.DTO.Client;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRes {
    private String id;
    private String name;
    private Boolean gender;
    private LocalDate birthday;
    private String phone;
    private String address;
    private String email;
    private LocalDateTime created_at;
    private LocalDateTime last_visit;
    private String img;
}