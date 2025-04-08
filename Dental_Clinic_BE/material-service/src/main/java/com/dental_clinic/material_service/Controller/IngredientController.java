package com.dental_clinic.material_service.Controller;

import com.dental_clinic.material_service.DTO.Request.CreateIngredient;
import com.dental_clinic.material_service.DTO.Request.UpdateIngredient;
import com.dental_clinic.material_service.DTO.Response.IngredientMultiSelectRes;
import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Service.IngredientService;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RequestMapping("/material/ingredient")
public class IngredientController {
    @Autowired
    IngredientService ingredientService;

    Gson gson;
    //    Create new
    @PostMapping("")
    public ResponseEntity<Ingredient> createNewIngredient(@RequestBody CreateIngredient req) {
        return new ResponseEntity<>(ingredientService.createNewIngredient(req), HttpStatus.CREATED);
    }

    //  Update
    @PutMapping("")
    public ResponseEntity<Ingredient> updateIngredient(@RequestBody UpdateIngredient req) {
        return  new ResponseEntity<>(ingredientService.updateIngredient(req),HttpStatus.OK);
    }

    @PatchMapping("/{id}/able")
    public ResponseEntity<?> toggleAbleIngredient(@PathVariable Long id) {
        ingredientService.toggleAbleIngredient(id);
        return ResponseEntity.ok(gson.toJson("Thay đổi thành công"));
    }

    @GetMapping("/able-true")
    public ResponseEntity<List<IngredientMultiSelectRes>> getListIngreAbleTrue () {
        return ResponseEntity.ok(ingredientService.getIngredientAbleTrue());
    }
}
