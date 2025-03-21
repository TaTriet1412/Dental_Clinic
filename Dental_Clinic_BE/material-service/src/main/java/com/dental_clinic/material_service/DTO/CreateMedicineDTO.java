package com.dental_clinic.material_service.DTO;

import lombok.Getter;

@Getter
public class CreateMedicineDTO {
    private Long id;
    private String cared_actor;
    private Integer revenue;
    private Integer cost;
    private String instruction;
}
