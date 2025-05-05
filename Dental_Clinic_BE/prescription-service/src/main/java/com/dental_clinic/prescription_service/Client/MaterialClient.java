package com.dental_clinic.prescription_service.Client;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.prescription_service.DTO.Client.InfoChangeQuantityMaterialReq;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PutExchange;

import java.util.List;

@HttpExchange
public interface MaterialClient {
    @PutExchange("/material/list/update-quantity")
    ApiResponse<Object> updateQuantityOfListMaterial(@Valid @RequestBody InfoChangeQuantityMaterialReq req);
}