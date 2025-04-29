package com.dental_clinic.payment_service.Client;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface PatientClient {
    @GetExchange("/patient/{id}")
    public ApiResponse<Object> getPatientById(@PathVariable String id);
}
