package com.dental_clinic.material_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.material_service.DTO.Request.CreateCategory;
import com.dental_clinic.material_service.DTO.Request.UpdateCategory;
import com.dental_clinic.material_service.Entity.Category;
import com.dental_clinic.material_service.Service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/material/category")
public class CategoryController {
    private CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<Object> getAllCategory(){
        List<Category> categoryList = categoryService.getAllCategories();
        return ApiResponse.builder()
                .result(categoryList)
                .apiCode(200)
                .message("Lấy danh sách danh mục thành công!")
                .build();
    }

    @GetMapping("{id}")
    public ApiResponse<Object> getCategoryById(@PathVariable Long id){
        return ApiResponse.builder()
                .result(categoryService.getById(id))
                .apiCode(200)
                .message("Lấy danh mục thành công!")
                .build();
    }

    @ResponseStatus(HttpStatus.CREATED)
   @PostMapping
   public ApiResponse<Object> createCategory(@RequestBody CreateCategory categoryDTO) {
       return ApiResponse.builder()
               .result(categoryService.createCategory(categoryDTO))
               .apiCode(201)
               .message("Tạo danh mục thành công!")
               .build();
   }

   @PutMapping("{id}")
   public ApiResponse<Object> updateCategory(@RequestBody UpdateCategory updateCategory,
                                       @PathVariable Long id) {
       return ApiResponse.builder()
               .result(categoryService.updateCategory(updateCategory, id))
               .apiCode(200)
               .message("Cập nhật danh mục thành công!")
               .build();
   }

   @DeleteMapping("{id}")
   public ApiResponse<Object> deleteCategory(@PathVariable Long id) {
       categoryService.deleteCategory(id);
       return ApiResponse.builder()
               .result(null)
               .apiCode(200)
               .message("Xóa danh mục thành công!")
               .build();
   }

   @PatchMapping("{id}/able")
    public ApiResponse<Object> ableCategory(@PathVariable Long id) {
         Category category = categoryService.toggleAble(id);
         return ApiResponse.builder()
                .result(category)
                .apiCode(200)
                .message(category.isAble() ? "Đã kích hoạt danh mục" : "Đã khóa danh mục")
                .build();
    }
}
