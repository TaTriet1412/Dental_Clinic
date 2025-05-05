package com.dental_clinic.material_service.DTO.Request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record InfoChangeQuantityMaterialReq(
        @NotNull(message = "Id người thay đổi không được để trống")
        Long userId,
        @NotNull (message = "Tên nguời thay đổi không được để trống")
        String actorName,
        @Valid
        @NotNull(message = "Thiếu thông tin chi tiết vật tư")
        List<UpdateQuantityMaterialReq> updateQuantityMaterialReqs
) {
}
