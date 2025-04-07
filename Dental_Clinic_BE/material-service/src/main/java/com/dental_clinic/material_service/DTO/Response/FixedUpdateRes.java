package com.dental_clinic.material_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FixedUpdateRes {
    Long id;
    Long categoryId;
    String name;
    String func;
    String unit;
    LocalDate mfg_date;
    Integer quantity;
}
