package com.dental_clinic.payment_service.Client;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface DentalClient {
    @GetExchange("/dental/service/{id}/price_cost")
    public ApiResponse<Object> getPriceCostOfDental(@PathVariable String id);
    @GetExchange("/dental/service/{id}/able")
    public ApiResponse<Object> getActiveDentalById(@PathVariable String id);
}
