package com.dental_clinic.prescription_service.Repository;

import com.dental_clinic.prescription_service.Entity.Prescription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends MongoRepository<Prescription, String> {
    // Sử dụng @Query cho MongoDB
    @Query("{'pat_id': ?0}")
    List<Prescription> findByPatId(Long patId);

    @Query("{'den_id': ?0}")
    List<Prescription> findByDenId(Long medId);

    // Hoặc với điều kiện is_deleted
    @Query("{'pat_id': ?0, 'is_deleted': false}")
    List<Prescription> findByPatIdAndIsDeletedFalse(Long patId);

    @Query("{'den_id': ?0, 'is_deleted': false}")
    List<Prescription> findByDenIdAndIsDeletedFalse(Long medId);

    @Query(value = "{$or: [{'bill_id': null}, {'bill_id': {$exists: false}}], '_id': ?0}", exists = true)
    Boolean existsByIdAndBillIdIsNullOrNotPresent(String id);
}
