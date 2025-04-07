package com.dental_clinic.material_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MedicineRes {
    String name;
    Integer quantity;
    String unit;
    LocalDate mfg_date;
    boolean able;
    long revenue;
    long cost;
}
