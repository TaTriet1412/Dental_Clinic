package com.dental_clinic.prescription_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.prescription_service.DTO.Request.CreatePrescriptionReq;
import com.dental_clinic.prescription_service.DTO.Request.UpdateBillIdForPrescriptionReq;
import com.dental_clinic.prescription_service.DTO.Request.UpdatePrescriptionReq;
import com.dental_clinic.prescription_service.Service.PrescriptionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/prescription")
public class PrescriptionController {
    private PrescriptionService prescriptionService;

    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping
    public ApiResponse<Object> getAllPrescription(){
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách đơn thuốc thành công")
                .result(prescriptionService.getAllPrescriptions())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<Object> getPrescriptionById(@PathVariable String id) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy đơn thuốc thành công")
                .result(prescriptionService.getPrescriptionById(id))
                .build();
    }

    @GetMapping("/{id}/bill_id_null")
    public ApiResponse<Object> getPrescriptionHasBillNullById(@PathVariable String id){
        return ApiResponse.builder()
                .apiCode(200)
                .message("Kiểm tra đơn thuốc chưa có hóa đơn nào chứa thành công")
                .result(prescriptionService.getPrescriptionHasBillNullById(id))
                .build();
    }

    @GetMapping("/{id}/price")
    public ApiResponse<Object> getPrescriptionPriceById(@PathVariable String id) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy giá đơn thuốc thành công")
                .result(prescriptionService.getPrescriptionPrice(id))
                .build();
    }

    @GetMapping("/patient/{patId}")
    public ApiResponse<Object> getPrescriptionsByPatientId(
            @PathVariable Long patId) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách đơn thuốc thành công")
                .result(prescriptionService.getPrescriptionsByPatientId(patId))
                .build();
    }

    @GetMapping("/dentist/{denId}")
    public ApiResponse<Object> getPrescriptionsByDentistId(
            @PathVariable Long denId) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách đơn thuốc thành công")
                .result(prescriptionService.getPrescriptionsByDentistId(denId))
                .build();
    }

    @PostMapping("/create-prescription")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Object> createPrescription(@Valid @RequestBody CreatePrescriptionReq request) throws JsonProcessingException {
        return ApiResponse.builder()
                .apiCode(201)
                .message("Tạo đơn thuốc thành công")
                .result(prescriptionService.createPrescription(request))
                .build();
    }

    @PutMapping("/update-prescription")
    public ApiResponse<Object> updatePrescription(@Valid @RequestBody UpdatePrescriptionReq request) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Cập nhật đơn thuốc thành công")
                .result(prescriptionService.updatePrescription(request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deletePrescription(@PathVariable String id) throws JsonProcessingException {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Xóa đơn thuốc thành công")
                .result(prescriptionService.deleteVariablePrescription(id))
                .build();
    }

    @PatchMapping("/{id}/bill")
    public ApiResponse<Object> updateBillIdForPrescription(@PathVariable String id, @Valid @RequestBody UpdateBillIdForPrescriptionReq request) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Cập nhật mã hóa đơn thành công")
                .result(prescriptionService.updateBillIdForPrescription(id, request.bill_id()))
                .build();
    }

    @PatchMapping("/{id}/remove-bill")
    public ApiResponse<Object> removeBillIdForPrescription(@PathVariable String id) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Xóa mã hóa đơn thành công")
                .result(prescriptionService.removeBillIdForPrescription(id))
                .build();
    }
}
