package com.dental_clinic.patient_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.patient_service.DTO.Request.CreatePatientReq;
import com.dental_clinic.patient_service.DTO.Request.UpdateLastVisted;
import com.dental_clinic.patient_service.DTO.Request.UpdatePatientReq;
import com.dental_clinic.patient_service.Entity.Patient;
import com.dental_clinic.patient_service.Service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    
    //    Lấy tất cả bệnh nhân
    @GetMapping
    public ApiResponse<Object> getAllPatients() {
        return ApiResponse.builder()
                .message("Lấy tất cả bệnh nhân thành công")
                .apiCode(200)
                .result(patientService.getAllPatients())
                .build();
    }

    //    Lấy thông tin bệnh nhân theo id
    @GetMapping("/{id}")
    public ApiResponse<Object> getPatientById(@PathVariable String id) {
        return ApiResponse.builder()
                .message("Lấy thông tin bệnh nhân thành công")
                .apiCode(200)
                .result(patientService.getById(id))
                .build();
    }
    
    //    Tạo bệnh nhân
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create-patient")
    public ApiResponse<Object> createPatient(@Valid @RequestBody CreatePatientReq req) {
        return ApiResponse.builder()
                .message("Tạo bệnh nhân thành công")
                .apiCode(200)
                .result(patientService.createPatient(req))
                .build();
    }

    //    Thay đổi thông tin bệnh nhân
    @PutMapping("/update-patient")
    public ApiResponse<Object> updatePatient(@Valid @RequestBody UpdatePatientReq req) {
        return ApiResponse.builder()
                .message("Cập nhật thông tin bệnh nhân thành công")
                .apiCode(200)
                .result(patientService.updatePatient(req))
                .build();
    }

    //    Cập nhật thời gian khám gần nhất
    @PatchMapping("/update-last-visited")
    public ApiResponse<Object> updateLastVisited(@Valid @RequestBody UpdateLastVisted req) {
        return ApiResponse.builder()
                .message("Cập nhật thời gian khám gần nhất thành công")
                .apiCode(200)
                .result(patientService.updateLastVisit(req))
                .build();
    }



}
