package com.dental_clinic.material_service.DTO.Request;


import java.time.LocalDate;

public record CreateFixedMaterial(
         Long categoryId,
         String name,
         String func,
         String unit,
         LocalDate mfg_date,
         Integer quantity
) {
}
