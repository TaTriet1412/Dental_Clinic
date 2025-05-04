package com.dental_clinic.payment_service.Repository;

import com.dental_clinic.payment_service.Entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

}
