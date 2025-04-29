package com.dental_clinic.schedule_service.Repository;

import com.dental_clinic.schedule_service.Entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    Page<Appointment> findAll(Pageable pageable);
}