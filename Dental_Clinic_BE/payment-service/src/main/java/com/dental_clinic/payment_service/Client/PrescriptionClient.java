package com.dental_clinic.payment_service.Client;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.dentist_service.DTO.Request.CreateAccountInfo;
import com.dental_clinic.dentist_service.DTO.Request.DeleteAccount;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.DeleteExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange
public interface AccountClient {
    @PostExchange("/auth/create_account")
    public ApiResponse<Object> createAccount(@RequestBody CreateAccountInfo accountInfo);

    @DeleteExchange("/auth/delete_account")
    public ApiResponse<?> deleteAccount(@RequestBody DeleteAccount deleteAccount);
}
