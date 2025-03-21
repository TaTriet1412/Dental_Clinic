package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.Entity.ConsumableMaterial;
import com.dental_clinic.material_service.Entity.FixedMaterial;
import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Repository.ConsumableMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsumableMaterialService {
    @Autowired
    private ConsumableMaterialRepository consumableMaterialRepository;
    @Autowired
    @Lazy
    private IngredientService ingredientService;

    public ConsumableMaterial getById(Long id) {
        return consumableMaterialRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Không tìm thấy vật liệu tiêu hao có id = '" + id + "'"));
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
