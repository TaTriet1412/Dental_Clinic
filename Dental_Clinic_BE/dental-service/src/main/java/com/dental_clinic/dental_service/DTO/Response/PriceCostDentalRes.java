package com.dental_clinic.dental_service.DTO.Response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PriceCostNameDentalRes {
    private int cost;
    private int price;
    private String name;
}
