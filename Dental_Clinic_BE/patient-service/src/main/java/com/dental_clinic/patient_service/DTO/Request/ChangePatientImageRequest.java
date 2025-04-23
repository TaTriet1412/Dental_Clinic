package com.dental_clinic.patient_service.DTO.Request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Data @Getter @Setter
public class ChangePatientImageRequest {
    private String patientId;
    private MultipartFile image;
}
