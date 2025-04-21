package com.dental_clinic.auth_service.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccountCreateRes {
    private Long id;
    private String email;
}
