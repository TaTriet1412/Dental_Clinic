package com.dental_clinic.prescription_service.DTO.Response;

import lombok.Builder;
import lombok.Getter;

import java.math.BigInteger;

@Getter
@Builder
public class PricePrescriptionRes {
    private BigInteger price;
}
