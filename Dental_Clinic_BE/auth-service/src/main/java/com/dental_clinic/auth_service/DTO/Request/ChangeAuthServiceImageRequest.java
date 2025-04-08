package com.dental_clinic.auth_service.DTO.Request;

import org.springframework.web.multipart.MultipartFile;

public record ChangeAuthServiceImageRequest(
    Long userId,
    MultipartFile image
){}
