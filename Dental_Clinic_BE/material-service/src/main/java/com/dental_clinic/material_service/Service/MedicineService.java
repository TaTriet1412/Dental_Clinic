package com.dental_clinic.material_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.material_service.DTO.Response.MedicineRes;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Entity.Medicine;
import com.dental_clinic.material_service.Repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class MedicineService {
    private final MedicineRepository medicineRepository;
    private final ConsumableMaterialService consumableMaterialService;

    @Autowired
    public MedicineService(MedicineRepository medicineRepository, ConsumableMaterialService consumableMaterialService) {
        this.medicineRepository = medicineRepository;
        this.consumableMaterialService = consumableMaterialService;
    }

    public List<Medicine> getAll() {
        return medicineRepository.findAll();
    }

    public Medicine getById(Long id) {
        return medicineRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy thuốc có id = '" + id + "'"));
    }

    public boolean isMedicine(Long id) {
        return medicineRepository.existsById(id);
    }


    public List<MedicineRes> getAllMedicine() {
        List<MedicineRes> resultArr = new ArrayList<>();
        for(Medicine me:medicineRepository.findAll()) {
            Material m = me.getConsumableMaterial().getMaterial();
            resultArr.add(new MedicineRes(
                    m.getName(),
                    m.getQuantity(),
                    m.getUnit(),
                    m.getMfg_date(),
                    m.isAble(),
                    me.getPrice(),
                    me.getCost()));
        }
        return resultArr;
    }

    public List<MedicineRes> getListMedicineByCatId(Long catId) {
        List<MedicineRes> resultArr = new ArrayList<>();
        for(Medicine me:medicineRepository.findAll()) {
            Material m = me.getConsumableMaterial().getMaterial();
            if(!Objects.equals(m.getCategory().getId(), catId)) continue;
            resultArr.add(new MedicineRes(
                    m.getName(),
                    m.getQuantity(),
                    m.getUnit(),
                    m.getMfg_date(),
                    m.isAble(),
                    me.getPrice(),
                    me.getCost()));
        }
        return resultArr;
    }
}

