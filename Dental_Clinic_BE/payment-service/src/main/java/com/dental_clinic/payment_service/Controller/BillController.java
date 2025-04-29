package com.dental_clinic.payment_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.payment_service.DTO.Request.CreateBillReq;
import com.dental_clinic.payment_service.DTO.Request.UpdateBillReq;
import com.dental_clinic.payment_service.Service.BillService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/payment")
@Validated
public class BillController {
    BillService billService;

    @Autowired
    public BillController(BillService billService) {
        this.billService = billService;
    }

    @GetMapping("/bill")
    public ApiResponse<Object> getAllBill() {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách hóa đơn thành công")
                .result(billService.getAllBill())
                .build();
    }

    @PostMapping("bill/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Object> createBill(@Valid @RequestBody CreateBillReq request) throws JsonProcessingException {
        return ApiResponse.builder()
                .apiCode(201)
                .message("Tạo hóa đơn thành công")
                .result(billService.createBill(request))
                .build();
    }

    @PutMapping("/bill/update")
    public ApiResponse<Object> updateBill(@Valid @RequestBody UpdateBillReq request) throws JsonProcessingException {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Cập nhật hóa đơn thành công")
                .result(billService.updateBill(request))
                .build();
    }
}
