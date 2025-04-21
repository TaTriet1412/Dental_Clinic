package com.dental_clinic.material_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicineUpdateRes {
    Long id;
    Long categoryId;
    String name;
    String func;
    String unit;
    LocalDate mfg_date;
    Integer quantity;
    List<Long> ingreIdList;
    String cared_actor;
    Integer revenue;
    Integer cost;
    String instruction;
}
