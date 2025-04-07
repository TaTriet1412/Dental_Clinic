package com.dental_clinic.material_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ConsumableUpdateRes {
    Long id;
    Long categoryId;
    String name;
    String func;
    String unit;
    LocalDate mfg_date;
    Integer quantity;
    List<Long> ingreIdList;
}
