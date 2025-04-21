package com.dental_clinic.material_service.DTO.Request;

import org.springframework.web.multipart.MultipartFile;

public record ChangeMaterialServiceImageRequest (
    Long materialId,
    MultipartFile image
){}
