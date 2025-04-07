package com.dental_clinic.material_service.DTO.Request;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public record UpdateConsumableMaterial(
        Long id,
        Long categoryId,
        Optional<String> name,
        Optional<String> func,
        Optional<String> unit,
        Optional<LocalDate> mfg_date,
        Optional<Integer> quantity,
        Optional<List<Long>> ingreIdList
) {
}
