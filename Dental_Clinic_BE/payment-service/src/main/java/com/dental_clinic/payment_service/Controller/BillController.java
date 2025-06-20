package com.dental_clinic.payment_service.Controller;

import com.dental_clinic.common_lib.constant.CaseVariableUtils;
import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.payment_service.DTO.Request.CreateBillReq;
import com.dental_clinic.payment_service.DTO.Request.UpdateBillReq;
import com.dental_clinic.payment_service.Entity.Bill;
import com.dental_clinic.payment_service.Entity.TransactionStatus;
import com.dental_clinic.payment_service.Service.BillService;
import com.dental_clinic.payment_service.Service.PaymentTransactionService;
import com.dental_clinic.payment_service.Service.payment.VnPayService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/payment")
@Validated
public class BillController {
    BillService billService;
    VnPayService vnPayService;
    PaymentTransactionService paymentTransactionService;

    @Autowired
    @Lazy
    public BillController(BillService billService, VnPayService vnPayService,
                          PaymentTransactionService paymentTransactionService)  {
        this.billService = billService;
        this.vnPayService = vnPayService;
        this.paymentTransactionService = paymentTransactionService;
    }

    @GetMapping("/bill")
    public ApiResponse<Object> getAllBill() {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách hóa đơn thành công")
                .result(billService.getAllBill())
                .build();
    }

    @GetMapping("/bill/{id}")
    public ApiResponse<Object> getBillById(@PathVariable Long id) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy hóa đơn thành công")
                .result(billService.getBillById(id))
                .build();
    }

    @GetMapping("/bill/pagination")
    public ApiResponse<Object> getPaginationBills(
            @RequestParam(required = false) String filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortFields) {
        try {
            Page<Bill> result = billService.getPaginationBills(filters, page, size, sortFields);
        
            return ApiResponse.builder()
                    .apiCode(200)
                    .message("Lấy danh sách hóa đơn phân trang thành công")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.builder()
                    .apiCode(400)
                    .message("Lỗi khi lấy danh sách hóa đơn: " + e.getMessage())
                    .result(null)
                    .build();
        }
    }

    @GetMapping("/bill/status")
    public ApiResponse<Object> getBillStatusList()
    {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách trạng thái hóa đơn thành công")
                .result(billService.getBillStatusList())
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

    @PutMapping("/bill/{id}/cancel")
    public ApiResponse<Object> cancelBill(@PathVariable Long id) throws JsonProcessingException {
        billService.cancelBill(id);
        return ApiResponse.builder()
                .apiCode(200)
                .message("Hủy hóa đơn thành công")
                .build();
    }

    @PostMapping("/vnpay")
    public ResponseEntity<Map<String, String>> submidBill(
            @RequestParam("amount") int billTotal,
            @RequestParam("billInfo") String billInfo,
            @RequestParam("billId") Long billId,
            @RequestParam("detailUrl") String detailUrl,
            HttpServletRequest request) {
//        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + "4200" + detailUrl;
        String baseUrl = "http://localhost:4200" + detailUrl;
        System.out.println("baseUrl: " + baseUrl);
        System.out.println("detailUrl: " + detailUrl);
        String vnpayUrl = vnPayService.createBill(billTotal, billInfo, baseUrl, billId);

        Map<String, String> response = new HashMap<>();
        response.put("redirectUrl", vnpayUrl);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/afterPayed")
    public ApiResponse<Object> afterPayment(HttpServletRequest request) throws Exception {
        // Lấy kết quả thanh toán từ dịch vụ (có thể trả về trạng thái giao dịch)
        int paymentStatus = vnPayService.billReturn(request);


        // Lấy các tham số trả về từ cổng thanh toán (VNPAY)
        String billInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
//        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");

        String vnp_BankCode = request.getParameter("vnp_BankCode");
        String vnp_BankTranNo = request.getParameter("vnp_BankTranNo");
        String vnp_CardType = request.getParameter("vnp_CardType");

        // Tách billId từ vnp_TxnRef (giả sử vnp_TxnRef có dạng "billId-transactionId")
        String billId = vnp_TxnRef.split("-")[0];
        String transactionId = vnp_TxnRef.split("-")[1];
        totalPrice = totalPrice.substring(0,totalPrice.length()-2);



        // Xử lý theo kết quả trả về của cổng thanh toán
        if ("00".equals(vnp_ResponseCode)) {
            // Thanh toán thành công, trả về ResponseEntity với thông báo thành công
            paymentTransactionService.updateStatusTransactionAfterPayment(Long.parseLong(transactionId), TransactionStatus.SUCCESS);
            billService.updateBillPayed(Long.valueOf(billId));

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Thanh toán thành công!");
            response.put("billId", billId);
            response.put("billInfo", billInfo);
            response.put("totalPrice",  totalPrice);
            response.put("paymentTime", paymentTime);
            response.put("transactionId", transactionId);

            // Trả về mã trạng thái 200 OK và dữ liệu JSON
            return ApiResponse.builder()
                    .message("Thanh toán thành công")
                    .apiCode(200)
                    .result(response)
                    .build();
        } else {
            paymentTransactionService.updateStatusTransactionAfterPayment(Long.parseLong(transactionId), TransactionStatus.FAIL);

            // Thanh toán thất bại, ném ngoại lệ và trả về lỗi với mã 400
            throw new AppException(ErrorCode.PAY_FAIL,"Thanh toán thất bại với mã phản hồi: " + vnp_ResponseCode);
        }
    }
}