package com.dental_clinic.material_service.Controller;

import com.dental_clinic.material_service.DTO.Request.*;
import com.dental_clinic.material_service.DTO.Response.*;
import com.dental_clinic.material_service.Service.ConsumableMaterialService;
import com.dental_clinic.material_service.Service.FixedMaterialService;
import com.dental_clinic.material_service.Service.MaterialService;
import com.dental_clinic.material_service.Service.MedicineService;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RequestMapping("/material")
public class MaterialController {
    @Autowired
    MaterialService materialService;
    @Autowired
    FixedMaterialService fixedMaterialService;
    @Autowired
    ConsumableMaterialService consumableMaterialService;
    @Autowired
    MedicineService medicineService;

    Gson gson;

    //  ** Material
    @PatchMapping("/{id}/able")
    public ResponseEntity<?> toggleAbleMaterial(@PathVariable Long id) {
        materialService.toggleAbleMaterial(id);
        return ResponseEntity.ok(gson.toJson("Thay đổi thành công"));
    }

//  *  FixedMaterial

    //    GetAll
    @GetMapping("/fixed-material")
    public ResponseEntity<List<FixedRes>> getAllFixedMaterial() {
        return new ResponseEntity<>(fixedMaterialService.getAllFixedMaterial(), HttpStatus.OK);
    }

    //    GetByCatId
    @GetMapping("fixed-material/category/{catId}")
    public ResponseEntity<List<FixedRes>> getListFixedMaterialByCatId(
            @PathVariable Long catId
    ) {
        return new ResponseEntity<>(fixedMaterialService.getListFixedMaterialByCatId(catId), HttpStatus.OK);
    }

    //    Create new
    @PostMapping("/fixed-material")
    public ResponseEntity<?> createNewFixedMaterial(@RequestBody CreateFixedMaterial req) {
        materialService.createFixedMaterial(req);
        return new ResponseEntity<>(gson.toJson("Thêm vật liệu cố định mới thành công"), HttpStatus.CREATED);
    }

    //    Update
    @PutMapping(value = "/fixed-material")
    public ResponseEntity<FixedUpdateRes> updateNewFixedMaterial(@RequestBody UpdateFixedMaterial req) {
        FixedUpdateRes result = materialService.updateFixedMaterial(req);
        return ResponseEntity.ok(result);
    }

//    * Consumable Material
//    + Not Medicine

    //    GetAll
    @GetMapping("/consumable-material")
    public ResponseEntity<List<ConsumableRes>> getAllConsumableMaterial() {
        return new ResponseEntity<>(consumableMaterialService.getAllConsumableMaterial(), HttpStatus.OK);
    }

    //    GetByCatId
    @GetMapping("consumable-material/category/{catId}")
    public ResponseEntity<List<ConsumableRes>> getListConsumableMaterialByCatId(
            @PathVariable Long catId
    ) {
        return new ResponseEntity<>(consumableMaterialService.getListConsumableMaterialByCatId(catId), HttpStatus.OK);
    }

    //    Create new
    @PostMapping("/consumable-material")
    public ResponseEntity<?> createNewConsumableMaterial(@RequestBody CreateConsumableMaterial req) {
        materialService.createConsumableMaterial(req);
        return new ResponseEntity<>(gson.toJson("Thêm vật liệu tiêu hao mới thành công"), HttpStatus.CREATED);
    }

    //  Update
    @PutMapping("/consumable-material")
    public ResponseEntity<?> updateConsumableMaterial(@RequestBody UpdateConsumableMaterial req) {
        ConsumableUpdateRes result = materialService.updateConsumableMaterial(req);
        return ResponseEntity.ok(result);
    }

//    + Medicine

    //    GetAll
    @GetMapping("/consumable-material/medicine")
    public ResponseEntity<List<MedicineRes>> getAllMedicine() {
        return new ResponseEntity<>(medicineService.getAllMedicine(), HttpStatus.OK);
    }

    //    GetByCatId
    @GetMapping("consumable-material/medicine/category/{catId}")
    public ResponseEntity<List<MedicineRes>> getListMedicineByCatId(
            @PathVariable Long catId
    ) {
        return new ResponseEntity<>(medicineService.getListMedicineByCatId(catId), HttpStatus.OK);
    }

    //    Create new
    @PostMapping("/consumable-material/medicine")
    public ResponseEntity<?> createNewMedicine(@RequestBody CreateMedicine req) {
        materialService.createMedicine(req);
        return new ResponseEntity<>(gson.toJson("Thêm thuốc mới thành công"), HttpStatus.CREATED);
    }

    //  Update
    @PutMapping("/consumable-material/medicine")
    public ResponseEntity<?> updateMedicine(@RequestBody UpdateMedicine req) {
        MedicineUpdateRes result = materialService.updateMedicine(req);
        return ResponseEntity.ok(result);
    }
}
