package com.dental_clinic.payment_service.Service.payment;

import com.dental_clinic.payment_service.Config.VnPayConfig;
import com.dental_clinic.payment_service.Entity.Bill;
import com.dental_clinic.payment_service.Entity.PaymentTransaction;
import com.dental_clinic.payment_service.Service.BillService;
import com.dental_clinic.payment_service.Service.PaymentTransactionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnPayService {
    PaymentTransactionService paymentTransactionService;
    BillService billService;

    @Autowired
    @Lazy
    public VnPayService(PaymentTransactionService paymentTransactionService,
                        BillService billService)  {
        this.paymentTransactionService = paymentTransactionService;
        this.billService = billService;
    }


    public String createBill(int total, String billInfo, String urlReturn, Long billId){
        Bill bill = billService.getBillById(billId);

        // Tạo transaction
        PaymentTransaction paymentTransaction = paymentTransactionService.createPaymentTransaction("vnpay", total, bill);

        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String vnp_TxnRef =  billId.toString() + "-" + paymentTransaction.getId().toString(); //Mã hóa đơn được thêm vào
        String vnp_IpAddr = "127.0.0.1";
        String vnp_TmnCode = VnPayConfig.vnp_TmnCode;
        String billType = "bill-type";

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(total*100));
        vnp_Params.put("vnp_CurrCode", "VND");

        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", billInfo);
        vnp_Params.put("vnp_OrderType", billType);

        String locate = "vn";
        vnp_Params.put("vnp_Locale", locate);

//        urlReturn += VnPayConfig.vnp_Returnurl;
        vnp_Params.put("vnp_ReturnUrl", urlReturn  );
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);

        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                //Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                try {
                    hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                    //Build query
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                    query.append('=');
                    query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }
        String queryUrl = query.toString();
        String vnp_SecureHash = VnPayConfig.hmacSHA512(VnPayConfig.vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;
        String paymentUrl = VnPayConfig.vnp_PayUrl + "?" + queryUrl;
        return paymentUrl;
    }

    public int billReturn(HttpServletRequest request){
        Map fields = new HashMap();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements();) {
            String fieldName = null;
            String fieldValue = null;
            fieldName = URLEncoder.encode((String) params.nextElement(), StandardCharsets.US_ASCII);
            fieldValue = URLEncoder.encode(request.getParameter(fieldName), StandardCharsets.US_ASCII);
            if ((fieldValue != null) && (!fieldValue.isEmpty())) {
                fields.put(fieldName, fieldValue);
            }
        }

        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }
        String signValue = VnPayConfig.hashAllFields(fields);
        if (signValue.equals(vnp_SecureHash)) {
            if ("00".equals(request.getParameter("vnp_TransactionStatus"))) {
                String ticketid = request.getParameter("vnp_TxnRef");
//                ticketService.updatePayment(Long.valueOf(ticketid));
                return 1;
            } else {
                return 0;
            }
        } else {
            return -1;
        }
    }

}