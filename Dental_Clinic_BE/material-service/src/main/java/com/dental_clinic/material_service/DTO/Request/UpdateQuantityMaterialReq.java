package com.dental_clinic.material_service.DTO.Request;

import jakarta.validation.constraints.NotNull;

public record UpdateQuantityMaterialReq(
        @NotNull (message = "Id không được để trống")
        Long id,
        @NotNull (message = "Số lượng không được để trống")
        Integer quantity

) {
}
