package com.dental_clinic.material_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.material_service.DTO.Request.CreateIngredient;
import com.dental_clinic.material_service.DTO.Request.UpdateIngredient;
import com.dental_clinic.material_service.DTO.Response.IngredientMultiSelectRes;
import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Service.IngredientService;
import com.google.gson.Gson;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RequestMapping("/material/ingredient")
public class IngredientController {
    IngredientService ingredientService;

    Gson gson;

    @Autowired
    public IngredientController(IngredientService ingredientService, Gson gson) {
        this.ingredientService = ingredientService;
        this.gson = gson;
    }

    //    Create new
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public ApiResponse<Object> createNewIngredient(@Valid @RequestBody CreateIngredient req) {
        return ApiResponse.builder()
                .apiCode(201)
                .message("Tạo mới nguyên liệu thành công")
                .result(ingredientService.createNewIngredient(req))
                .build();
    }

    //  Update
    @PutMapping("")
    public ApiResponse<Object> updateIngredient(@Valid @RequestBody UpdateIngredient req) {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Cập nhật nguyên liệu thành công")
                .result(ingredientService.updateIngredient(req))
                .build();
    }

    @PatchMapping("/{id}/able")
    public ApiResponse<Object> toggleAbleIngredient(@PathVariable Long id) {
        Ingredient ingredient = ingredientService.toggleAbleIngredient(id);
        return ApiResponse.builder()
                .apiCode(200)
                .message(ingredient.isAble() ? "Nguyên liệu đã được kích hoạt" : "Nguyên liệu đã bị vô hiệu hóa")
                .build();
    }

    @GetMapping("/able-true")
    public ApiResponse<Object> getListIngreAbleTrue() {
        return ApiResponse.builder()
                .apiCode(200)
                .message("Lấy danh sách nguyên liệu thành công")
                .result(ingredientService.getIngredientAbleTrue())
                .build();
    }
}
