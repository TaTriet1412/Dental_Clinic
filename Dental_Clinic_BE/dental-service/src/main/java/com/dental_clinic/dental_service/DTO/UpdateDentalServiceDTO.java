package com.dental_clinic.dental_service.DTO;

import lombok.Getter;

import java.util.Optional;

@Getter
public class UpdateDentalServiceDTO {
    Optional<String> name;
    Optional<Integer> cost;
    Optional<Integer> revenue;
    Optional<String> cared_actor;
    Optional<String> description;
    Optional<String> unit;
}
