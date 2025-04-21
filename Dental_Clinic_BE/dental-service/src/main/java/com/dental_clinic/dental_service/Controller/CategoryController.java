package com.dental_clinic.dental_service.Controller;

import com.dental_clinic.dental_service.DTO.CreateCategoryDTO;
import com.dental_clinic.dental_service.DTO.UpdateCategoryDTO;
import com.dental_clinic.dental_service.Entity.Category;
import com.dental_clinic.dental_service.Service.CategoryService;
import com.dental_clinic.common_lib.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/dental/category")
public class CategoryController {
    private CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ApiResponse<Object> getAllCategory() {
        return ApiResponse.builder()
                .message("Lấy danh sách danh mục dịch vụ thành công")
                .apiCode(HttpStatus.OK.value())
                .result(categoryService.getAllCategories())
                .build();
    }

    @GetMapping("{id}")
    public ApiResponse<Object> getCategoryById(@PathVariable String id) {
        return ApiResponse.builder()
                .message("Lấy thông tin danh mục dịch vụ thành công")
                .apiCode(HttpStatus.OK.value())
                .result(categoryService.getById(id))
                .build();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ApiResponse<Object> createCategory(@RequestBody CreateCategoryDTO categoryDTO) {
        return ApiResponse.builder()
                .message("Tạo danh mục dịch vụ thành công")
                .apiCode(HttpStatus.CREATED.value())
                .result(categoryService.createCategory(categoryDTO))
                .build();
    }

    @PutMapping("{id}")
    public ApiResponse<Object> updateCategory(@RequestBody UpdateCategoryDTO updateCategoryDTO,
                                              @PathVariable String id) {
        return ApiResponse.builder()
                .message("Cập nhật danh mục dịch vụ thành công")
                .apiCode(HttpStatus.OK.value())
                .result(categoryService.updateCategory(updateCategoryDTO, id))
                .build();
    }

    @DeleteMapping("{id}")
    public ApiResponse<?> deleteCategory(@PathVariable String id) {
        categoryService.deleteCategory(id);
        return ApiResponse.builder()
                .message("Xóa danh mục dịch vụ thành công")
                .apiCode(HttpStatus.OK.value())
                .build();
    }

    @PatchMapping("{id}/able")
    public ApiResponse<?> ableCategory(@PathVariable String id) {
        Category category = categoryService.toggleAble(id);
        return ApiResponse.builder()
                .message(category.getAble() ? "Đã kích hoạt danh mục dịch vụ" : "Đã vô hiệu hóa danh mục dịch vụ")
                .apiCode(HttpStatus.OK.value())
                .result(category)
                .build();
    }


}
