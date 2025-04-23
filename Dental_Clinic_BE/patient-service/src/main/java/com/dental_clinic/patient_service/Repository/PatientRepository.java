package com.dental_clinic.patient_service.Repository;

import com.dental_clinic.patient_service.Entity.Patient;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    Optional<Patient> findByImg(String imgUrl);
    @Aggregation(pipeline = {
            "{ $project: { _id: 0, img: 1 } }"
    })
    List<String> findAllImg();
    boolean existsByPhone(String phone);
    boolean existsByPhoneAndIdNot(String phone, String id);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, String id);

}
