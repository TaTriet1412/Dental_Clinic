package com.dental_clinic.material_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.material_service.DTO.Response.ConsumableRes;
import com.dental_clinic.material_service.Entity.ConsumableMaterial;
import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Repository.ConsumableMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ConsumableMaterialService {
    private final ConsumableMaterialRepository consumableMaterialRepository;
    private final IngredientService ingredientService;
    private final MedicineService medicineService;

    @Autowired
    @Lazy
    public ConsumableMaterialService(IngredientService ingredientService, ConsumableMaterialRepository consumableMaterialRepository, MedicineService medicineService) {
        this.ingredientService = ingredientService;
        this.consumableMaterialRepository = consumableMaterialRepository;
        this.medicineService = medicineService;
    }

    public ConsumableMaterial getById(Long id) {
        return consumableMaterialRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy vật liệu tiêu hao có id = '" + id + "'"));
    }

    public ConsumableRes getConsumableResById(Long id) {
        ConsumableMaterial consumableMaterial = getById(id);
        Material m = consumableMaterial.getMaterial();
        return new ConsumableRes(
                m.getId(),
                m.getName(),
                m.getQuantity(),
                m.getUnit(),
                m.getCreated_at(),
                m.getMfg_date(),
                m.isAble(),
                m.getFunc(),
                consumableMaterial.getIngredientList().stream().map(Ingredient::getId).collect(Collectors.toList()),
                m.getCategoryId(),
                m.getImg()
        );
    }

    public List<ConsumableRes> getAllConsumableMaterial() {
        List<ConsumableRes> resultArr = new ArrayList<>();
        for(ConsumableMaterial c:consumableMaterialRepository.findAll()) {
            if(medicineService.isMedicine(c.getId())) continue;
            Material m = c.getMaterial();
            resultArr.add(new ConsumableRes(
                    m.getId(),
                    m.getName(),
                    m.getQuantity(),
                    m.getUnit(),
                    m.getCreated_at(),
                    m.getMfg_date(),
                    m.isAble(),
                    m.getFunc(),
                    m.getConsumableMaterial().getIngredientList().stream().map(Ingredient::getId).collect(Collectors.toList()),
                    m.getCategoryId(),
                    m.getImg()
            ));
        }
        return resultArr;
    }

    public List<ConsumableRes> getListConsumableMaterialByCatId(Long catId) {
        List<ConsumableRes> resultArr = new ArrayList<>();
        for(ConsumableMaterial c:consumableMaterialRepository.findAll()) {
            Material m = c.getMaterial();
            if(!Objects.equals(m.getCategory().getId(), catId)
                || medicineService.isMedicine(c.getId())) continue;
            resultArr.add(new ConsumableRes(
                    m.getId(),
                    m.getName(),
                    m.getQuantity(),
                    m.getUnit(),
                    m.getCreated_at(),
                    m.getMfg_date(),
                    m.isAble(),
                    m.getFunc(),
                    m.getConsumableMaterial().getIngredientList().stream().map(Ingredient::getId).collect(Collectors.toList()),
                    m.getCategoryId(),
                    m.getImg()
            ));
        }
        return resultArr;
    }


    public ConsumableMaterial saveNewConsumableMaterial(Long materialId) {
        return consumableMaterialRepository.save(new ConsumableMaterial(materialId));
    }

    public void addIngredientForConMaterial(List<Ingredient> ingredientList,Long materialId) {
        ConsumableMaterial consumableMaterial = getById(materialId);
        consumableMaterial.setIngredientList(ingredientList);

        consumableMaterialRepository.save(consumableMaterial);
    }
    
    public void updateIngredientForConMaterial(List<Ingredient> ingredientList,Long materialId){
        ConsumableMaterial consumableMaterial = getById(materialId);
        consumableMaterial.setIngredientList(ingredientList);

        consumableMaterialRepository.save(consumableMaterial);
    }
}
