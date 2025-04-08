package com.dental_clinic.auth_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@AllArgsConstructor
public class AccountUpdateRes {
    Long userId;
    String email;
    String name;
    String address;
    LocalDate birthday;
    String phone;
    Integer salary;
}
