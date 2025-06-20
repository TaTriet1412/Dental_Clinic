package com.dental_clinic.payment_service.Repository;

import com.dental_clinic.payment_service.Entity.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long>, JpaSpecificationExecutor<Bill> {
    // Define the findAll method explicitly
    @Override
    Page<Bill> findAll(Specification<Bill> spec, Pageable pageable);
}