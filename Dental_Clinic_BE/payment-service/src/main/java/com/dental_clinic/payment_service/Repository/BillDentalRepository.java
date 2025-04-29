package com.dental_clinic.payment_service.Repository;

import com.dental_clinic.payment_service.Entity.BillDental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillDentalRepository extends JpaRepository<BillDental, Long> {
}
