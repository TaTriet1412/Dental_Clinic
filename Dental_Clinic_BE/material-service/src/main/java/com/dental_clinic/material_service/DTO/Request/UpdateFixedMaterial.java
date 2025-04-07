package com.dental_clinic.material_service.DTO.Request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.util.Optional;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public record UpdateFixedMaterial(
        Long id,
        Long categoryId,
        Optional<String>  name,
        Optional<String> func,
        Optional<String> unit,
        Optional<LocalDate> mfg_date,
        Optional<Integer> quantity
) {
}
