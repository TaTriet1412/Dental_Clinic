package com.dental_clinic.patient_service.Entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection="patients")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {
    @Id
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
