package com.dental_clinic.material_service.DTO.Request;

import java.time.LocalDate;
import java.util.List;

public record CreateConsumableMaterial(
        Long categoryId,
        String name,
        String func,
        String unit,
        LocalDate mfg_date,
        Integer quantity,
        List<Long> ingreIdList
) {
}
