package com.dental_clinic.payment_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.payment_service.Entity.Bill;
import com.dental_clinic.payment_service.Entity.PaymentTransaction;
import com.dental_clinic.payment_service.Entity.TransactionStatus;
import com.dental_clinic.payment_service.Repository.PaymentTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentTransactionService {
    PaymentTransactionRepository paymentTransactionRepository;

    @Autowired
    public PaymentTransactionService(PaymentTransactionRepository paymentTransactionRepository) {
        this.paymentTransactionRepository = paymentTransactionRepository;
    }

    public PaymentTransaction getPaymentTransactionById(Long id) {
        return paymentTransactionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Transaction not found"));
    }

    public PaymentTransaction createPaymentTransaction(
            String paymentMethod,
            Integer amount_paid,
            Bill bill
    ) {
        return paymentTransactionRepository.save(
                PaymentTransaction.builder()
                    .amountPaid(amount_paid)
                    .paymentMethod(paymentMethod)
                    .status(TransactionStatus.PENDING.getStatus())
                    .createdAt(LocalDateTime.now())
                    .bill(bill)
                    .build());
    }

    public PaymentTransaction updateStatusTransactionAfterPayment(
            Long transactionId,
            TransactionStatus status
    ) {
        PaymentTransaction paymentTransaction = getPaymentTransactionById(transactionId);
        paymentTransaction.setStatus(status.getStatus());
        return paymentTransactionRepository.save(paymentTransaction);
    }
}
