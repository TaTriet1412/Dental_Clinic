package com.dental_clinic.material_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.material_service.DTO.Request.CreateIngredient;
import com.dental_clinic.material_service.DTO.Request.UpdateIngredient;
import com.dental_clinic.material_service.DTO.Response.IngredientMultiSelectRes;
import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Repository.IngredientRepository;
import com.dental_clinic.material_service.Utils.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class IngredientService {
    private IngredientRepository ingredientRepository;

    @Lazy
    @Autowired
    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }
    public Ingredient getById(Long id) {
        return ingredientRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy thành phần có id = '" + id + "'"));
    }

    public List<Ingredient> getAll() {
        return ingredientRepository.findAll();
    }

    public List<Ingredient> getListIngredientByListIdHasAble(List<Long> idList) {
        List<Ingredient> resultList = new ArrayList<>();
        for (Long id:idList) {
            Ingredient ingredient = getById(id);
            if(!ingredient.isAble())
                throw  new AppException(ErrorCode.NOT_FOUND,"Không còn hỗ trợ thành phần có id = " + ingredient.getName());
            resultList.add(ingredient);
        }

        return resultList;
    }

    public Ingredient createNewIngredient(CreateIngredient req) {
        FieldUtils.checkFieldIsEmptyOrNull(req.name(),"Tên thành phần");
        if(ingredientRepository.existsByName(req.name()))
            throw new AppException(ErrorCode.EXISTED_DATA,"Tên thành phần đã tồn tại");

        return ingredientRepository.save(Ingredient.builder()
                        .name(req.name())
                        .able(true)
                        .created_at(LocalDateTime.now())
                .build());
    }

    public Ingredient updateIngredient(UpdateIngredient req) {
        FieldUtils.checkFieldIsEmptyOrNull(req.name(),"Tên thành phần");
        if(ingredientRepository.existsByNameAndIdNot(req.name(),req.id()))
            throw new AppException(ErrorCode.EXISTED_DATA,"Tên thành phần đã tồn tại");

        Ingredient i = getById(req.id());

        i.setName(req.name());

        return ingredientRepository.save(i);
    }

    public Ingredient toggleAbleIngredient(Long id) {
        Ingredient i = getById(id);
        i.setAble(!i.isAble());
        return ingredientRepository.save(i);
    }

    public List<IngredientMultiSelectRes> getIngredientAbleTrue() {
        List<IngredientMultiSelectRes> resultArr = new ArrayList<>();
        for(Ingredient i: ingredientRepository.findAllByAbleTrue()) {
            resultArr.add(new IngredientMultiSelectRes(i.getName(),i.getId()));
        }

        return resultArr;
    }
}
