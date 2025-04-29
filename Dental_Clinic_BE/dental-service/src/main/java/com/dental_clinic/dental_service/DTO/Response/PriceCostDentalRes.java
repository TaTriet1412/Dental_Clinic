package com.dental_clinic.dental_service.DTO.Response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PriceCostDentalRes {
    private int cost;
    private int price;
}
