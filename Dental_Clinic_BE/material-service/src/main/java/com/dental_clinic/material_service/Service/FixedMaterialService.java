package com.dental_clinic.material_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.material_service.DTO.Response.FixedRes;
import com.dental_clinic.material_service.Entity.FixedMaterial;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Repository.FixedMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class FixedMaterialService {
    private final FixedMaterialRepository fixedMaterialRepository;

    @Autowired
    @Lazy
    public FixedMaterialService(FixedMaterialRepository fixedMaterialRepository) {
        this.fixedMaterialRepository = fixedMaterialRepository;
    }

    public FixedMaterial getById(Long id) {
        return fixedMaterialRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy vật liệu cố định có id = '" + id + "'"));
    }

    public FixedRes getFixedResById(Long id) {
        FixedMaterial fixedMaterial = getById(id);
        Material m = fixedMaterial.getMaterial();
        return new FixedRes(
                m.getId(),
                m.getName(),
                m.getQuantity(),
                m.getUnit(),
                m.getCreated_at(),
                m.getMfg_date(),
                m.isAble(),
                m.getFunc(),
                m.getCategoryId(),
                m.getImg()
        );
    }

    public FixedMaterial saveNewFixedMaterial(Long materialId) {
        return fixedMaterialRepository.save(new FixedMaterial(materialId));
    }

    public FixedRes getFixedRes(Material m) {
        return new FixedRes(
                m.getId(),
                m.getName(),
                m.getQuantity(),
                m.getUnit(),
                m.getCreated_at(),
                m.getMfg_date(),
                m.isAble(),
                m.getFunc(),
                m.getCategoryId(),
                m.getImg()
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
