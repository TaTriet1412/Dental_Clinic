package com.dental_clinic.material_service.DTO.Response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FixedRes {
    Long id;
    String name;
    Integer quantity;
    String unit;
    LocalDateTime created_at;
    LocalDate mfg_date;
    boolean able;
    String func;
    Long categoryId;
    String img;
}
