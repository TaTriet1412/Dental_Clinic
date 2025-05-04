package com.dental_clinic.material_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicineRes {
    Long id;
    String name;
    Integer quantity;
    String unit;
    LocalDate mfg_date;
    boolean able;
    Integer price;
    Integer cost;
    String instruction;
    String cared_actor;
    List<Long> ingreIdList;
    String func;
    Long categoryId;
    String img;
    LocalDateTime created_at;

}
