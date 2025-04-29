package com.dental_clinic.payment_service.Client;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.payment_service.DTO.Client.UpdateBillIdForPrescriptionReq;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PatchExchange;

@HttpExchange
public interface PrescriptionClient {
    @GetExchange("/prescription/{id}/price")
    ApiResponse<Object> getPrice(@PathVariable String id);
    @PatchExchange("/prescription/{id}/bill")
    ApiResponse<Object> updateBillIdForPrescription(@PathVariable String id, @Valid @RequestBody UpdateBillIdForPrescriptionReq req);
    @PatchExchange("/prescription/{id}/remove-bill")
    ApiResponse<Object> removeBillIdForPrescription(@PathVariable String id);
    @GetExchange("/prescription/{id}/bill_id_null")
    ApiResponse<Object> getPrescriptionHasBillNullById(@PathVariable String id);
}