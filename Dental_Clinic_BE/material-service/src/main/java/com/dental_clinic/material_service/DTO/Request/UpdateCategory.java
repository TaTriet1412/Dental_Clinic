package com.dental_clinic.material_service.DTO.Request;

import java.util.Optional;

public record UpdateCategory(
        Optional<String> name,
        Optional<String> note,
        Optional<String> description
) {
}
