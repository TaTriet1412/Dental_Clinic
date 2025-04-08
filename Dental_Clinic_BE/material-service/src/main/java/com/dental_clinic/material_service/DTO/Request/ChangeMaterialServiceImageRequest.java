package com.dental_clinic.material_service.DTO.Request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

public record ChangeMaterialServiceImageRequest (
    Long materialId,
    MultipartFile image
){}
