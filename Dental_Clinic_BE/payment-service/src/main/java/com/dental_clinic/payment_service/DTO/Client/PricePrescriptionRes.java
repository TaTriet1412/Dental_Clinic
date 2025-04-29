package com.dental_clinic.payment_service.DTO.Client;

import lombok.Builder;
import lombok.Getter;

import java.math.BigInteger;

@Getter
@Builder
public class PricePrescriptionRes {
    private BigInteger price;
}
