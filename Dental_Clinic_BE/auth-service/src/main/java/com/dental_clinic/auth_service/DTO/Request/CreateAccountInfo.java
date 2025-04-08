package com.dental_clinic.auth_service.DTO.Request;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccountInfo {
    private String email;
    private Long roleId;
    private String name;
    private String address;
    @JsonProperty("birthday")
    private LocalDate birthDate;
    private String phone;
    private Integer salary;
    private boolean gender;
}