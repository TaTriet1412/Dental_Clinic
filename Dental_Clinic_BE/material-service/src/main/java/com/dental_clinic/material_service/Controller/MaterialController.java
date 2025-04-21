package com.dental_clinic.material_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.material_service.DTO.Request.*;
import com.dental_clinic.material_service.DTO.Response.*;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Service.*;
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
@FieldDefaults(makeFinal = true, level = lombok.AccessLevel.PRIVATE)
@RequestMapping("/material")
public class MaterialController {
    MaterialService materialService;
    FixedMaterialService fixedMaterialService;
    ConsumableMaterialService consumableMaterialService;
    MedicineService medicineService;


    Gson gson;

    @Autowired
    public MaterialController(MaterialService materialService, FixedMaterialService fixedMaterialService, ConsumableMaterialService consumableMaterialService, MedicineService medicineService, Gson gson) {
        this.materialService = materialService;
        this.fixedMaterialService = fixedMaterialService;
        this.consumableMaterialService = consumableMaterialService;
        this.medicineService = medicineService;
        this.gson = gson;
    }

    //  ** Material
    @PatchMapping("/{id}/able")
    public ApiResponse<Object> toggleAbleMaterial(@PathVariable Long id) {
        Material material = materialService.toggleAbleMaterial(id);
        return ApiResponse.builder()
                .result((material.isAble() ? "Đã kích hoạt " : "Đã vô hiệu hóa") + "vật liệu")
                .apiCode(200)
                .message("Thay đổi trạng thái vật liệu thành công")
                .build();
    }

//  *  FixedMaterial

    //    GetAll
   @GetMapping("/fixed-material")
   public ApiResponse<Object> getAllFixedMaterial() {
       return ApiResponse.builder()
               .result(fixedMaterialService.getAllFixedMaterial())
               .apiCode(200)
               .message("Lấy danh sách vật liệu cố định thành công!")
               .build();
   }

   //    GetByCatId
   @GetMapping("fixed-material/category/{catId}")
   public ApiResponse<Object> getListFixedMaterialByCatId(@PathVariable Long catId) {
       return ApiResponse.builder()
               .result(fixedMaterialService.getListFixedMaterialByCatId(catId))
               .apiCode(200)
               .message("Lấy danh sách vật liệu cố định theo danh mục thành công!")
               .build();
   }

   //    Create new
   @ResponseStatus(HttpStatus.CREATED)
   @PostMapping("/fixed-material")
   public ApiResponse<Object> createNewFixedMaterial(@RequestBody CreateFixedMaterial req) {
       materialService.createFixedMaterial(req);
       return ApiResponse.builder()
               .result(null)
               .apiCode(201)
               .message("Thêm vật liệu cố định mới thành công")
               .build();
   }

   //    Update
   @PutMapping(value = "/fixed-material")
   public ApiResponse<Object> updateNewFixedMaterial(@RequestBody UpdateFixedMaterial req) {
       return ApiResponse.builder()
               .result(materialService.updateFixedMaterial(req))
               .apiCode(200)
               .message("Cập nhật vật liệu cố định thành công")
               .build();
   }

//    * Consumable Material
//    + Not Medicine

    //    GetAll
    @GetMapping("/consumable-material")
    public ApiResponse<Object> getAllConsumableMaterial() {
        return ApiResponse.builder()
                .result(consumableMaterialService.getAllConsumableMaterial())
                .apiCode(200)
                .message("Lấy danh sách vật liệu tiêu hao thành công!")
                .build();
    }

    //    GetByCatId
    @GetMapping("consumable-material/category/{catId}")
    public ApiResponse<Object> getListConsumableMaterialByCatId(@PathVariable Long catId) {
        return ApiResponse.builder()
                .result(consumableMaterialService.getListConsumableMaterialByCatId(catId))
                .apiCode(200)
                .message("Lấy danh sách vật liệu tiêu hao theo danh mục thành công!")
                .build();
    }

    //    Create new
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/consumable-material")
    public ApiResponse<Object> createNewConsumableMaterial(@RequestBody CreateConsumableMaterial req) {
        materialService.createConsumableMaterial(req);
        return ApiResponse.builder()
                .result(null)
                .apiCode(201)
                .message("Thêm vật liệu tiêu hao mới thành công")
                .build();
    }

    //  Update
    @PutMapping("/consumable-material")
    public ApiResponse<Object> updateConsumableMaterial(@RequestBody UpdateConsumableMaterial req) {
        return ApiResponse.builder()
                .result(materialService.updateConsumableMaterial(req))
                .apiCode(200)
                .message("Cập nhật vật liệu tiêu hao thành công")
                .build();
    }

//    + Medicine

    //    GetAll
   @GetMapping("/consumable-material/medicine")
    public ApiResponse<Object> getAllMedicine() {
        return ApiResponse.builder()
                .result(medicineService.getAllMedicine())
                .apiCode(200)
                .message("Lấy danh sách thuốc thành công!")
                .build();
    }

    //    GetByCatId
    @GetMapping("consumable-material/medicine/category/{catId}")
    public ApiResponse<Object> getListMedicineByCatId(@PathVariable Long catId) {
        return ApiResponse.builder()
                .result(medicineService.getListMedicineByCatId(catId))
                .apiCode(200)
                .message("Lấy danh sách thuốc theo danh mục thành công!")
                .build();
    }

    //    Create new
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/consumable-material/medicine")
    public ApiResponse<Object> createNewMedicine(@RequestBody CreateMedicine req) {
        materialService.createMedicine(req);
        return ApiResponse.builder()
                .result(null)
                .apiCode(201)
                .message("Thêm thuốc mới thành công")
                .build();
    }

    //  Update
    @PutMapping("/consumable-material/medicine")
    public ApiResponse<Object> updateMedicine(@RequestBody UpdateMedicine req) {
        return ApiResponse.builder()
                .result(materialService.updateMedicine(req))
                .apiCode(200)
                .message("Cập nhật thuốc thành công")
                .build();
    }

//    Đổi ảnh
    @PutMapping(value = "/change-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Object> changeImg(@ModelAttribute ChangeMaterialServiceImageRequest request) {
        materialService.changeImg(request);
        return ApiResponse.builder()
                .result(null)
                .apiCode(200)
                .message("Thay đổi ảnh thành công")
                .build();
    }

}
