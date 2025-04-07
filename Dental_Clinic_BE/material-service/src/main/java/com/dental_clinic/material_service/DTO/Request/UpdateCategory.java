package com.dental_clinic.material_service.DTO.Request;

import lombok.Getter;

@Getter
public class UpdateCategory {
    private String name;
    private String note;
    private String description;
    private boolean able;
}
