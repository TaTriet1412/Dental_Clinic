package com.dental_clinic.material_service.Repository;

import com.dental_clinic.material_service.Entity.ConsumableMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConsumableMaterialRepository extends JpaRepository<ConsumableMaterial,Long> {
}
