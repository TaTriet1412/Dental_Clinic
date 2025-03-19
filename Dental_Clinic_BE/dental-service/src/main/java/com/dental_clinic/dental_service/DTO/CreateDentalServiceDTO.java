package com.dental_clinic.dental_service.DTO;

import lombok.Getter;

@Getter
public class CreateDentalServiceDTO {
    private String categoryId;
    private String name;
    private Integer cost;
    private Integer revenue;
    private String cared_actor;
    private String description;
    private String unit;
}
