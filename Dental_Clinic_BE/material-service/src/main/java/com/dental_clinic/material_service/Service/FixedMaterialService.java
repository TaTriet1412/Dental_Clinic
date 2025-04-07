package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.DTO.Response.FixedRes;
import com.dental_clinic.material_service.Entity.FixedMaterial;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Repository.FixedMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class FixedMaterialService {
    @Autowired
    private FixedMaterialRepository fixedMaterialRepository;

    public FixedMaterial getById(Long id) {
        return fixedMaterialRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy vật liệu cố định có id = '" + id + "'"));
    }

    public void saveNewFixedMaterial(Long materialId) {
        fixedMaterialRepository.save(new FixedMaterial(materialId));
    }

    public FixedRes getFixedRes(Material m) {
        return new FixedRes(
                m.getName(),
                m.getQuantity(),
                m.getUnit(),
                m.getCreated_at(),
                m.getMfg_date(),
                m.isAble()
        );
    }

    public List<FixedRes> getAllFixedMaterial() {
        List<FixedRes> resultArr = new ArrayList<>();
        for(FixedMaterial f:fixedMaterialRepository.findAll()) {
            Material m = f.getMaterial();
            resultArr.add(getFixedRes(m));
        }
        return resultArr;
    }

    public List<FixedRes> getListFixedMaterialByCatId(Long catId) {
        List<FixedRes> resultArr = new ArrayList<>();
        for(FixedMaterial f:fixedMaterialRepository.findAll()) {
            Material m = f.getMaterial();
            if(!Objects.equals(m.getCategory().getId(), catId)) continue;
            resultArr.add(getFixedRes(m));
        }
        return resultArr;
    }
}
