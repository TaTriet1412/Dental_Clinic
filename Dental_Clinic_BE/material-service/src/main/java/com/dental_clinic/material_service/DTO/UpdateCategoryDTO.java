package com.dental_clinic.material_service.DTO;

import lombok.Getter;

@Getter
public class UpdateCategoryDTO {
    private String name;
    private String note;
    private String description;
    private boolean able;
}
