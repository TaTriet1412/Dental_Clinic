package com.dental_clinic.auth_service.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
public class UserDetailRes {
    private Long id;
    private String name;
    private String email;
    private String address;
    private String phone;
    private LocalDate birthday;
    private Integer salary;
    private LocalDateTime createdAt;
    private boolean gender;
    private boolean isBan;
    private String img;
}
