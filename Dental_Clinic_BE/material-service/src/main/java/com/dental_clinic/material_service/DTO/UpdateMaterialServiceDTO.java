package com.dental_clinic.material_service.DTO;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class UpdateMaterialServiceDTO {
    private String name;
    private String func;
    private String unit;
    private LocalDate mfg_date;
    private Integer quantity;
    private String description;
//    able không bao giờ null
    private boolean able;
    private List<Long> ingreIdList;
}
