package com.dental_clinic.material_service.DTO;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Data @Getter @Setter
public class ChangeMaterialServiceImageRequest {
    private Long materialServiceId;
    private MultipartFile image;
}
