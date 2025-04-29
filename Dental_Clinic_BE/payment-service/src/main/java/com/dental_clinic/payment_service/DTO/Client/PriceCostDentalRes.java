package com.dental_clinic.payment_service.DTO.Client;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PriceCostNameDentalRes {
    private int cost;
    private int price;
    private String name;
}
