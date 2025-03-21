package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.Entity.FixedMaterial;
import com.dental_clinic.material_service.Repository.FixedMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FixedMaterialService {
    @Autowired
    private FixedMaterialRepository fixedMaterialRepository;

    public void saveNewFixedMaterial(Long materialId) {
        fixedMaterialRepository.save(new FixedMaterial(materialId));
    }
}
