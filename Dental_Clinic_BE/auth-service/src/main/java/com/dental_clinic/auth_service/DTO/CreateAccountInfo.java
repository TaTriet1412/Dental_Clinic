package com.dental_clinic.auth_service.DTO;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccountInfo {
    private Long id;
    private String email;
    private String role;
    private String password;
    private String name;
    @JsonProperty("birthday")
    private LocalDate birthDate;
    private String phone;
}