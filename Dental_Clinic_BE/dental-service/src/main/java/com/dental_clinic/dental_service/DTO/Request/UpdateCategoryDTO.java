package com.dental_clinic.dental_service.DTO.Request;

import lombok.Getter;

import java.util.Optional;

@Getter
public class UpdateCategoryDTO {
    Optional<String> name;
    Optional<String> note;
}
