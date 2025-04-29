package com.dental_clinic.dental_service.DTO.Request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Data @Getter @Setter
public class ChangeDentalServiceImageRequest {
    private String dentalServiceId;
    private MultipartFile image;
}
