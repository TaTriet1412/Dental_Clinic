package com.dental_clinic.dentist_service.Repository;

import com.dental_clinic.dentist_service.Entity.Dentist;
import com.dental_clinic.dentist_service.Entity.Faculty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DentistRepository extends JpaRepository<Dentist, Long> {
    boolean existsBySpecialty(String specialty);
    List<Dentist> findByExperienceYearGreaterThan(Integer years);
    List<Dentist> findByFaculty(Faculty faculty);
}
