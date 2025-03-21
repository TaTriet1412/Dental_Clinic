package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class IngredientService {
    @Autowired
    private IngredientRepository ingredientRepository;

    public Ingredient getById(Long id) {
        return ingredientRepository.findById(id).orElseThrow(() ->
                new RuntimeException("Không tìm thấy thành phần có id = '" + id + "'"));
    }

    public List<Ingredient> getAll() {
        return ingredientRepository.findAll();
    }

    public List<Ingredient> getListIngredientByListId(List<Long> idList) {
        List<Ingredient> resultList = new ArrayList<>();
        for (Long id:idList) {
            Ingredient ingredient = getById(id);
            resultList.add(ingredient);
        }

        return resultList;
    }
}
