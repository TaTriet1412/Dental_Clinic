package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.DTO.ChangeMaterialServiceImageRequest;
import com.dental_clinic.material_service.DTO.CreateMaterialServiceDTO;
import com.dental_clinic.material_service.DTO.UpdateMaterialServiceDTO;
import com.dental_clinic.material_service.Entity.Category;
import com.dental_clinic.material_service.Entity.ConsumableMaterial;
import com.dental_clinic.material_service.Entity.Ingredient;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Repository.MaterialRepository;
import com.dental_clinic.material_service.Utils.FieldUtils;
import com.dental_clinic.material_service.Utils.ImageUtils;
import com.dental_clinic.material_service.Utils.VariableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.dental_clinic.material_service.Utils.VariableUtils.DEFAULT_MATERIAL;
import static com.dental_clinic.material_service.Utils.VariableUtils.TYPE_UPLOAD_MATERIAL_SERVICE;


@Service
public class MaterialService {
    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    @Lazy
    private CategoryService categoryService;

    @Autowired
    @Lazy
    private FixedMaterialService fixedMaterialService;

    @Autowired
    @Lazy
    private ConsumableMaterialService consumableMaterialService;

    @Autowired
    @Lazy
    private IngredientService ingredientService;

    public boolean isCategoryInUse(Long id) {
        Category category = categoryService.getById(id);
        return materialRepository.existsByCategory(category);
    }

    public List<Material> getAllMaterialServices() {
        return materialRepository.findAll();
    }

    public Material getById(Long id) {
        return materialRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy vật liệu có id = '" + id + "'"));
    }

    //    Đổi ảnh cho vật liệu
    public void changeImg(ChangeMaterialServiceImageRequest request) {
        // Kiểm tra vật liệu tồn tại không
        Material material_service = materialRepository.findById(
                request.getMaterialServiceId()).orElseThrow( 
                        () ->  new RuntimeException("Vật liệu không tồn tại"));
        // Kiểm tra file hợp lệ
        MultipartFile file = request.getImage();
        ImageUtils.checkImageFile(file);
        // Tạo thư mục upload nếu chưa tồn tại
        try {
            ImageUtils.createUploadDirIfNotExists(TYPE_UPLOAD_MATERIAL_SERVICE);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi tạo thư mục upload: " + e.getMessage());
        }
        // Thực hiện thay đổi material service img
        try {
            // Lưu file vào server
            String fileName = ImageUtils.saveFileServer(file, TYPE_UPLOAD_MATERIAL_SERVICE);
            // Xóa file cũ
            if (!material_service.getImg().equals(VariableUtils.DEFAULT_MATERIAL)) {
                ImageUtils.deleteFileServer(material_service.getImg());
            }
            // Cập nhật đường dẫn file mới vào database
            material_service.setImg(fileName);
            materialRepository.save(material_service);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu tập tin: " + e.getMessage());
        }
    }

//

    public Material createMaterialService(CreateMaterialServiceDTO request) {
        //        Kiểm tra trường thông tin có sai định dạng không
        FieldUtils.checkFieldIsEmptyOrNull(request.getCategoryId(),"Mã phân loại");
        FieldUtils.checkFieldIsEmptyOrNull(request.getName(),"Tên vật liệu");
        FieldUtils.checkFieldIsEmptyOrNull(request.getUnit(),"Đơn vị");
        FieldUtils.checkFieldIsEmptyOrNull(request.getQuantity(),"Số lượng");
        FieldUtils.checkFieldIsEmptyOrNull(request.getMfg_date(),"Ngày sản xuất");
        FieldUtils.checkFieldIsEmptyOrNull(request.getFunc(),"Chức năng");
        FieldUtils.checkFieldIsEmptyOrNull(request.isFixed()
                ,"Loại vật liệu (cố định, tiêu hao)");

        FieldUtils.checkNumberIsIntegerAndNotNegative(request.getQuantity());

        if(!categoryService.isAbleByCategoryId(request.getCategoryId()))
            throw new RuntimeException("Phân loại '" + request.getCategoryId() + "'" + " đã đóng");
        if(materialRepository.existsByName(request.getName()))
            throw new RuntimeException("Đã tồn tại vật liệu '" + request.getName() + "'");

//        kiểm tra nếu là vật liệu tiêu hao mà không có thành phần thì thông báo lỗi
        if(!request.isFixed())
            FieldUtils.checkListEmpty(request.getIngreIdList()," thành phần");

//        Kiểm tra có tồn tại thành phần với mảng id đã nhập không
        List<Ingredient> ingredientList = new ArrayList<>();
        if(!request.isFixed()) {
            ingredientList = ingredientService.getListIngredientByListId(request.getIngreIdList());
        }


//        Tiến hành lưu vật liệu
        categoryService.getById(request.getCategoryId());

        Material material = Material.builder()
                .category(categoryService.getById(request.getCategoryId()))
                .created_at(LocalDateTime.now())
                .able(true)
                .name(request.getName())
                .func(request.getFunc())
                .unit(request.getUnit())
                .img(DEFAULT_MATERIAL)
                .mfg_date(request.getMfg_date())
                .quantity(request.getQuantity())
                .build();

        Material savedMaterial = materialRepository.save(material);

//        Lưu phân loại fixed hay consumable
        if (request.isFixed()) {
            fixedMaterialService.saveNewFixedMaterial(savedMaterial.getId());
        } else {
            ConsumableMaterial consumableMaterial =
                    consumableMaterialService.saveNewConsumableMaterial(savedMaterial.getId());
            consumableMaterialService.addIngredientForConMaterial
                    (ingredientList,consumableMaterial.getId());
        }

        return savedMaterial;
    }

    public Material updateMaterialService(UpdateMaterialServiceDTO req, Long id) {
//        Lấy Material cũ
        Material material = getById(id);

        FieldUtils.checkNumberIsIntegerAndNotNegative(req.getQuantity());

        // Kiểm tra giá trị mới, chỉ cập nhật nếu không null
        Optional.ofNullable(req.getName())
                .ifPresent(name -> {
                    FieldUtils.checkStrEmpty(name, "Tên vật liệu");
                    if(materialRepository.existsByNameAndIdNot(name,id))
                        throw new RuntimeException("Đã tồn tại vật liệu '" + name + "'");
                    material.setName(name);
                });

        Optional.ofNullable(req.getUnit())
                .ifPresent(unit -> {
                    FieldUtils.checkStrEmpty(unit, "Đơn vị");
                    material.setUnit(unit);
                });

        Optional.ofNullable(req.getFunc())
                .ifPresent(func -> {
                    FieldUtils.checkStrEmpty(func, "Chức năng");
                    material.setFunc(func);
                });

        // Kiểm tra số nguyên và không âm
        Optional.ofNullable(req.getQuantity())
                .ifPresent(quantity -> {
                    FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
                    material.setQuantity(quantity);
                });

        Optional.ofNullable(req.getMfg_date())
                .ifPresent(mfgDate -> {
                    if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                        throw new RuntimeException("Ngày sản xuất không được quá ngày hiện tại");
                });
        Optional.of(req.isAble())
                .ifPresent(able -> {
                    if(!material.isAble() && !able)
                        throw new RuntimeException("Vật liệu '" + req.getName() + "' đã đóng");
                    material.setAble(able);
                });


        //        Kiểm tra có tồn tại thành phần với mảng id đã nhập không (Đối với vật liệu tiêu hao)
        if (material.getConsumableMaterial()!=null && req.getIngreIdList() != null) {
            List<Ingredient> ingredientList
                    = ingredientService.getListIngredientByListId(req.getIngreIdList());
            consumableMaterialService.updateIngredientForConMaterial
                    (ingredientList,material.getId());
        }


        return materialRepository.save(material);
    }

    //    Kiểm tra able của material
    public boolean isAbleByMaterialId(Long id) {
        return getById(id).isAble();
    }
}
