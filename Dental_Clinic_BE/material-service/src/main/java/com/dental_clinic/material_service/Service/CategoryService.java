package com.dental_clinic.material_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.material_service.DTO.Request.CreateCategory;
import com.dental_clinic.material_service.DTO.Request.UpdateCategory;
import com.dental_clinic.material_service.Entity.Category;
import com.dental_clinic.material_service.Repository.CategoryRepository;
import com.dental_clinic.material_service.Utils.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    @Lazy
    private MaterialService materialService;

    //   Lấy tất cả các phân loại vật liệu
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

    //    Lấy phân loại vật liệu theo id
    public Category getById(Long id){
        return categoryRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy phân loại vật liệu có id = '" + id + "'"));
    }

    //    Kiểm tra tên tồn tại chưa
    public boolean isNameExists(String name) {
        return categoryRepository.existsByName(name);
    }

    //    Kiểm tra tên tồn tại chưa ngoại trừ tên cũ (phục vụ cho  PutMapping)
    public boolean isNameExistsExcludingOldName(String name, Long excludeId) {
        return categoryRepository.existsByNameAndIdNot(name,excludeId);
    }

    //    Kiểm tra able của category
    public boolean isAbleByCategoryId(Long id) {
        return getById(id).isAble();
    }


    //    Tạo phân loại mới
    public Category createCategory(CreateCategory createCategory){
//        Kiểm tra trường thông tin có sai định dạng không
        FieldUtils.checkFieldIsEmptyOrNull(createCategory.name(),"Họ tên");
        FieldUtils.checkFieldIsEmptyOrNull(createCategory.description(),"Mô tả");
        FieldUtils.checkFieldIsEmptyOrNull(createCategory.note(),"Ghi chú");
        if (isNameExists(createCategory.name()) )
            throw new
                    AppException(ErrorCode.EXISTED_DATA,"Đã tồn tại phân loại vật liệu '" +
                                        createCategory.name() + "'");

//        Tiến hành lưu vào db
        return categoryRepository.save(
                Category.builder()
                        .name(createCategory.name())
                        .note(createCategory.note())
                        .created_at(LocalDateTime.now())
                        .description(createCategory.description())
                        .able(true)
                        .build());
    }

    //    Thay đổi trường thông tin
    public Category updateCategory(UpdateCategory updateCategory, Long id) {
//        Tìm kiếm phân loại vật liệu được gọi qua id
        Category category = getById(id);

        //        Kiểm tra trường thông tin có sai định dạng không
        updateCategory.name().ifPresent(name -> {
            FieldUtils.checkFieldIsEmptyOrNull(name,"Tên phân loại");
            if (isNameExistsExcludingOldName(name, category.getId()))
                throw new AppException(ErrorCode.EXISTED_DATA,"Đã tồn tại phân loại vật liệu '" +
                        name + "'");
            category.setName(name);
        });

        updateCategory.note().ifPresent(note -> {
            FieldUtils.checkFieldIsEmptyOrNull(note,"Ghi chú");
            category.setNote(note);
        });

        updateCategory.description().ifPresent(description -> {
            FieldUtils.checkFieldIsEmptyOrNull(description,"Mô tả");
            category.setDescription(description);
        });

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        //        Tìm kiếm phân loại vật liệu được gọi qua id
        Category category = getById(id);

        // Kiểm tra liệu category có được tham chiếu đến bởi material entity nào không
        if (materialService.isCategoryInUse(id))
            throw new AppException
                    (ErrorCode.INVALID_REQUEST,"Phân loại với " + id +
                            " còn đang được sử dụng bởi vật liệu nào đó. Nên không thể xóa phân loại này");

//        Xóa thành công
        categoryRepository.delete(category);
    }

    public Category toggleAble(Long id) {
        Category category = getById(id);
        category.setAble(!category.isAble());
        return categoryRepository.save(category);
    }
}
