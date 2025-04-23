package com.dental_clinic.patient_service.Controller;

import com.dental_clinic.patient_service.Service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/patient")
@Validated
public class PatientController {
    PatientService patientService;

    @Autowired
    PatientController(PatientService patientService) {
        this.patientService = patientService;
    }


}
