package com.dental_clinic.material_service.Repository;

import com.dental_clinic.material_service.Entity.FixedMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FixedMaterialRepository extends JpaRepository<FixedMaterial,Long> {
}
