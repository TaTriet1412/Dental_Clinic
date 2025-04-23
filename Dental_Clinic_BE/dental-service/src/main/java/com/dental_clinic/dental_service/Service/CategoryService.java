package com.dental_clinic.dental_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;

import com.dental_clinic.dental_service.DTO.CreateCategoryDTO;
import com.dental_clinic.dental_service.DTO.UpdateCategoryDTO;
import com.dental_clinic.dental_service.Entity.Category;
import com.dental_clinic.dental_service.Entity.Dental;
import com.dental_clinic.dental_service.Repository.CategoryRepository;
import com.dental_clinic.dental_service.Utils.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final DentalService dentalService;
    private static final Logger logger = LoggerFactory.getLogger(CategoryService.class);

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, DentalService dentalService) {
        this.categoryRepository = categoryRepository;
        this.dentalService = dentalService;
    }


    //   Lấy tất cả các phân loại dịch vụ
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

//    Lấy phân loại dịch vụ theo id
    public Category getById(String id){
        return categoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy phân loại dịch vụ có id = '" + id + "'"));
    }

//    Kiểm tra tên tồn tại chưa
    public boolean isNameExists(String name) {
        return categoryRepository.existsByName(name);
    }

//    Kiểm tra tên tồn tại chưa ngoại trừ tên cũ (phục vụ cho  PutMapping)
    public boolean isNameExistsExcludingOldName(String name, String excludeId) {
        return categoryRepository.existsByNameAndNameNot(name,excludeId);
    }

//    Tạo phân loại mới
    public Category createCategory(CreateCategoryDTO createCategoryDTO){
        if (isNameExists(createCategoryDTO.getName()) )
            throw new AppException(ErrorCode.EXISTED_DATA, "Đã tồn tại phân loại dịch vụ '" + createCategoryDTO.getName() + "'");

        Category category = Category.builder()
                .name(createCategoryDTO.getName())
                .note(createCategoryDTO.getNote())
                .created_at(LocalDateTime.now())
                .able(true)
                .build());

        categoryRepository.save(category);

        logger.info("Created new category: name={}, note={}", category.getName(), category.getNote());
        return category;
    }

//    Thay đổi trường thông tin
    public Category updateCategory(UpdateCategoryDTO updateCategoryDTO, String id) {
        Category category = getById(id);

        StringBuilder logMessage = new StringBuilder("Updated category id=" + id + ": ");
        boolean hasChanges = false;

        String oldName = category.getName();
        String oldNote = category.getNote();

        updateCategoryDTO.getName().ifPresent(name -> {
            FieldUtils.checkFieldIsEmptyOrNull(name, "Tên phân loại");
            if (isNameExistsExcludingOldName(name, category.getId()))
                throw new AppException(ErrorCode.EXISTED_DATA, "Đã tồn tại phân loại dịch vụ '" + name + "'");
            category.setName(name);
        });

        updateCategoryDTO.getNote().ifPresent(note -> {
            FieldUtils.checkFieldIsEmptyOrNull(note, "Ghi chú");
            category.setNote(note);
        });

        // Kiểm tra và ghi log các trường thay đổi
        if (updateCategoryDTO.getName().isPresent() && !category.getName().equals(oldName)) {
            logMessage.append("name from ").append(oldName).append(" to ").append(category.getName()).append("\n");
            hasChanges = true;
        }
        if (updateCategoryDTO.getNote().isPresent() && !category.getNote().equals(oldNote)) {
            logMessage.append("note from ").append(oldNote).append(" to ").append(category.getNote()).append("\n");
            hasChanges = true;
        }

        if (hasChanges) {
            categoryRepository.save(category);
            logger.info(logMessage.toString());
        } else {
            categoryRepository.save(category);
        }
        
        return category;
    }

    public void deleteCategory(String id) {
        Category category = getById(id);

        // Kiểm tra liệu category có được tham chiếu đến bởi dental entity nào không
        if (dentalService.isCategoryInUse(id))
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Phân loại với " + id + " còn đang được sử dụng bởi dịch vụ nào đó. Nên không thể xóa phân loại này");

        categoryRepository.delete(category);
    }

    public Category toggleAble(String id) {
        Category category = getById(id);
        category.setAble(!category.getAble());
        return categoryRepository.save(category);
    }

    public boolean isAbleByCategoryId(String id) {
        return getById(id).getAble();
    }

}
