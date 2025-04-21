package com.dental_clinic.dentist_service.DTO.Client;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AccountCreateRes {
    private Long id;
    private String email;
}
