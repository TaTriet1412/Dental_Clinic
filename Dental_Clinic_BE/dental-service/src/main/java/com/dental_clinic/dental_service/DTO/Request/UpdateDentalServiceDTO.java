package com.dental_clinic.dental_service.DTO.Request;

import lombok.Getter;

import java.util.Optional;

@Getter
public class UpdateDentalServiceDTO {
    Optional<String> name;
    Optional<Integer> cost;
    Optional<Integer> price;
    Optional<String> cared_actor;
    Optional<String> description;
    Optional<String> unit;
}
