package com.dental_clinic.material_service.DTO;

public record UpdateMedicineDTO(
     String cared_actor,
     Integer revenue,
     Integer cost,
     String instruction
) {}
