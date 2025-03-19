package com.dental_clinic.dental_service.DTO;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class CreateCategoryDTO {
    private String name;
    private String note;
}
