package com.dental_clinic.material_service.DTO;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class CreateMaterialServiceDTO {
    private Long categoryId;
    private String name;
    private String func;
    private String unit;
    private LocalDate mfg_date;
    private Integer quantity;
    private boolean isFixed;
    private List<Long> ingreIdList;
}
