package com.dental_clinic.dental_service.Service;

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

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private DentalService dentalService;


//   Lấy tất cả các phân loại dịch vụ
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }

//    Lấy phân loại dịch vụ theo id
    public Category getById(String id){
        return categoryRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy phân loại dịch vụ có id = '" + id + "'"));
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
//        Kiểm tra trường thông tin có sai định dạng không
        FieldUtils.checkFieldIsEmptyOrNull(createCategoryDTO.getName(),"Họ tên");
        FieldUtils.checkFieldIsEmptyOrNull(createCategoryDTO.getNote(),"Ghi chú");
        if (isNameExists(createCategoryDTO.getName()) )
            throw new RuntimeException("Đã tồn tại phân loại dịch vụ '" + createCategoryDTO.getName() + "'");

//        Tiến hành lưu vào db
       return categoryRepository.save(
               Category.builder()
                .name(createCategoryDTO.getName())
                .note(createCategoryDTO.getNote())
                .created_at(LocalDateTime.now())
                .able(true)
                .build());
    }

//    Thay đổi trường thông tin
    public Category updateCategory(UpdateCategoryDTO updateCategoryDTO, String id) {
//        Tìm kiếm phân loại dịch vụ được gọi qua id
        Category category = getById(id);

        //        Kiểm tra trường thông tin có sai định dạng không
        FieldUtils.checkFieldIsEmptyOrNull(updateCategoryDTO.getName(),"Tên phân loại");
        FieldUtils.checkFieldIsEmptyOrNull(updateCategoryDTO.getNote(),"Ghi chú");
        FieldUtils.checkFieldIsEmptyOrNull(updateCategoryDTO.isAble(),"Trạng thái");


        if(isNameExistsExcludingOldName(updateCategoryDTO.getName(), category.getId()))
            throw new RuntimeException("Đã tồn tại phân loại dịch vụ '" + updateCategoryDTO.getName() + "'");

        //        Cập nhật category
        category.setAble(updateCategoryDTO.isAble());
        category.setNote(updateCategoryDTO.getNote());
        category.setName(updateCategoryDTO.getName());
        return categoryRepository.save(category);
    }

    public void deleteCategory(String id) {
        //        Tìm kiếm phân loại dịch vụ được gọi qua id
        Category category = getById(id);

        // Kiểm tra liệu category có được tham chiếu đến bởi dental entity nào không
        if (dentalService.isCategoryInUse(id))
            throw new RuntimeException
                    ("Phân loại với " + id + " còn đang được sử dụng bởi dịch vụ nào đó. Nên không thể xóa phân loại này");

//        Xóa thành công
        categoryRepository.delete(category);
    }

}
