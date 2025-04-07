package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.DTO.Request.ChangeMaterialServiceImageRequest;
import com.dental_clinic.material_service.DTO.Request.*;
import com.dental_clinic.material_service.DTO.Response.ConsumableUpdateRes;
import com.dental_clinic.material_service.DTO.Response.FixedRes;
import com.dental_clinic.material_service.DTO.Response.FixedUpdateRes;
import com.dental_clinic.material_service.DTO.Response.MedicineUpdateRes;
import com.dental_clinic.material_service.Entity.*;
import com.dental_clinic.material_service.Repository.MaterialRepository;
import com.dental_clinic.material_service.Repository.MedicineRepository;
import com.dental_clinic.material_service.Utils.FieldUtils;
import com.dental_clinic.material_service.Utils.ImageUtils;
import com.dental_clinic.material_service.Utils.VariableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.dental_clinic.material_service.Utils.VariableUtils.DEFAULT_MATERIAL;
import static com.dental_clinic.material_service.Utils.VariableUtils.TYPE_UPLOAD_MATERIAL_SERVICE;


@Service
public class MaterialService {
    @Autowired
    private MaterialRepository materialRepository;

    @Autowired
    private MedicineRepository medicineRepository;

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
    private MedicineService medicineService;

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

    public void validateCreateMaterialRequest(Long categoryId, String name, String unit, Integer quantity, LocalDate mfgDate, String func) {
        FieldUtils.checkFieldIsEmptyOrNull(categoryId,"Mã phân loại");
        FieldUtils.checkFieldIsEmptyOrNull(name,"Tên vật liệu");
        FieldUtils.checkFieldIsEmptyOrNull(unit,"Đơn vị");
        FieldUtils.checkFieldIsEmptyOrNull(quantity,"Số lượng");
        FieldUtils.checkFieldIsEmptyOrNull(mfgDate,"Ngày sản xuất");
        FieldUtils.checkFieldIsEmptyOrNull(func,"Chức năng");

        FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
        if (!categoryService.isAbleByCategoryId(categoryId))
            throw new RuntimeException("Phân loại '" + categoryId + "'" + " đã đóng");
        if (materialRepository.existsByName(name))
            throw new RuntimeException("Đã tồn tại vật liệu '" + name + "'");

        if(FieldUtils.isLocalDateMoreThanToday(mfgDate)) {
            throw new RuntimeException("Ngày sản xuất không được vượt quá hôm nay");
        }
    }

    public Material buildAndSaveMaterial(Long categoryId, String name, String unit, Integer quantity,
                                         LocalDate mfgDate, String func, String defaultImg) {
        Material material = Material.builder()
                .category(categoryService.getById(categoryId))
                .created_at(LocalDateTime.now())
                .able(true)
                .name(name)
                .func(func)
                .unit(unit)
                .img(defaultImg)
                .mfg_date(mfgDate)
                .quantity(quantity)
                .build();

        return materialRepository.save(material);
    }

// Tạo vật liệu cố định

    public void createFixedMaterial(CreateFixedMaterial request) {
        validateCreateMaterialRequest(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func()
        );

        Material savedMaterial = buildAndSaveMaterial(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func(),
                DEFAULT_MATERIAL
        );

        fixedMaterialService.saveNewFixedMaterial(savedMaterial.getId());
    }

//    Tạo vật liệu tiêu hao (không phải thuốc)
    public void createConsumableMaterial(CreateConsumableMaterial request) {
        validateCreateMaterialRequest(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func()
        );

        List<Ingredient> ingredientList = ingredientService.getListIngredientByListId(request.ingreIdList());

        Material savedMaterial = buildAndSaveMaterial(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func(),
                DEFAULT_MATERIAL
        );

        ConsumableMaterial consumableMaterial =
                consumableMaterialService.saveNewConsumableMaterial(savedMaterial.getId());
        consumableMaterialService.addIngredientForConMaterial(ingredientList, consumableMaterial.getId());
    }

//    Tạo vật liệu tiêu hao (là thuốc)
    public void createMedicine(CreateMedicine request) {
        validateCreateMaterialRequest(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func()
        );

        //        Kiểm tra trường thông tin có sai định dạng không
        FieldUtils.checkFieldIsEmptyOrNull(request.instruction(),"Hưỡng dẫn sử dụng");
        FieldUtils.checkFieldIsEmptyOrNull(request.cared_actor(),"Đối tượng sử dụng");
        FieldUtils.checkFieldIsEmptyOrNull(request.revenue(),"Giá");
        FieldUtils.checkFieldIsEmptyOrNull(request.cost(),"Chi phí");


        FieldUtils.checkNumberIsIntegerAndNotNegative(request.revenue());
        FieldUtils.checkNumberIsIntegerAndNotNegative(request.cost());

        if(request.revenue() < request.cost())
            throw new RuntimeException("Chi phí không được lớn hơn giá vật liệu");


        List<Ingredient> ingredientList = ingredientService.getListIngredientByListId(request.ingreIdList());

        Material savedMaterial = buildAndSaveMaterial(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func(),
                DEFAULT_MATERIAL
        );

        ConsumableMaterial consumableMaterial =
                consumableMaterialService.saveNewConsumableMaterial(savedMaterial.getId());
        consumableMaterialService.addIngredientForConMaterial(ingredientList, consumableMaterial.getId());

        medicineRepository.save(
                Medicine.builder()
                        .id(savedMaterial.getId())
                        .cost(request.cost())
                        .revenue(request.revenue())
                        .instruction(request.instruction())
                        .cared_actor(request.cared_actor())
                        .build()
        );
    }

//    Chỉnh sửa vật liệu cố định
    public FixedUpdateRes updateFixedMaterial(UpdateFixedMaterial request) {
        Material material = getById(request.id());
        fixedMaterialService.getById(request.id());
        Category category = categoryService.getById(request.categoryId());

        boolean isAbleOfMaterial = material.isAble();
        boolean isAbleOfCategory = category.isAble();

        if (!isAbleOfCategory)
            throw new RuntimeException("Phân loại vật liệu '" + category.getId() + "'" + " đã đóng");
        if (!isAbleOfMaterial)
            throw new RuntimeException("Vật liệu tiêu hao '" + material.getId() + "'" + " đã đóng");

        if (!material.getCategory().getId().equals(category.getId())) {
            throw new RuntimeException("Mã phân loại của vật liệu không khớp với dữ liệu thực");
        }

        request.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Tên vật liệu");
            if(materialRepository.existsByNameAndIdNot(name,request.id()))
                throw new RuntimeException("Đã tồn tại vật liệu '" + name + "'");
            material.setName(name);
        });
        request.unit().ifPresent(unit -> {
            FieldUtils.checkStrEmpty(unit, "Đơn vị");
            material.setUnit(unit);
        });
        request.quantity().ifPresent(quantity -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
            material.setQuantity(quantity);
        });
        request.func().ifPresent(func -> {
            FieldUtils.checkStrEmpty(func, "Chức năng");
            material.setFunc(func);
        });
        request.mfg_date().ifPresent(mfgDate -> {
            if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                throw new RuntimeException("Ngày sản xuất không được quá ngày hiện tại");
        });

        Material m = materialRepository.save(material);

        return new FixedUpdateRes(
                m.getId(),
                m.getCategoryId(),
                m.getName(),
                m.getFunc(),
                m.getUnit(),
                m.getMfg_date(),
                m.getQuantity()
        );
    }

//    Chỉnh sửa vật liệu tiêu hao
    public ConsumableUpdateRes updateConsumableMaterial(UpdateConsumableMaterial request) {
        Material material = getById(request.id());
        consumableMaterialService.getById(request.id());
        Category category = categoryService.getById(request.categoryId());

        boolean isAbleOfMaterial = material.isAble();
        boolean isAbleOfCategory = category.isAble();

        if (!isAbleOfCategory)
            throw new RuntimeException("Phân loại vật liệu '" + category.getId() + "'" + " đã đóng");
        if (!isAbleOfMaterial)
            throw new RuntimeException("Vật liệu tiêu hao '" + material.getId() + "'" + " đã đóng");
        if(medicineService.isMedicine(material.getId()))
            throw new RuntimeException("Chỉ hỗ trợ vật liệu tiêu hao không phải thuốc");


        if (!material.getCategory().getId().equals(category.getId())) {
            throw new RuntimeException("Mã phân loại của vật liệu không khớp với dữ liệu thực");
        }

        request.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Tên vật liệu");
            if(materialRepository.existsByNameAndIdNot(name,request.id()))
                throw new RuntimeException("Đã tồn tại vật liệu '" + name + "'");
            material.setName(name);
        });
        request.unit().ifPresent(unit -> {
            FieldUtils.checkStrEmpty(unit, "Đơn vị");
            material.setUnit(unit);
        });
        request.quantity().ifPresent(quantity -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
            material.setQuantity(quantity);
        });
        request.func().ifPresent(func -> {
            FieldUtils.checkStrEmpty(func, "Chức năng");
            material.setFunc(func);
        });
        request.mfg_date().ifPresent(mfgDate -> {
            if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                throw new RuntimeException("Ngày sản xuất không được quá ngày hiện tại");
        });

        request.ingreIdList().ifPresent(ingreList -> {
            List<Ingredient> ingredientList =
                    ingredientService.getListIngredientByListId(ingreList);
            consumableMaterialService.updateIngredientForConMaterial
                    (ingredientList,material.getId());
        });

        Material m = materialRepository.save(material);
        ConsumableMaterial c = consumableMaterialService.getById(m.getId());
        List<Long> ingreIdList = new ArrayList<>();
        for(Ingredient i: c.getIngredientList()) {
            ingreIdList.add(i.getId());
        }

        return new ConsumableUpdateRes(
                m.getId(),
                m.getCategoryId(),
                m.getName(),
                m.getFunc(),
                m.getUnit(),
                m.getMfg_date(),
                m.getQuantity(),
                ingreIdList
        );
    }

//    Chỉnh sửa thuốc
    public MedicineUpdateRes updateMedicine(UpdateMedicine request) {
        Material material = getById(request.id());
        Medicine medicine = medicineService.getById(request.id());
        Category category = categoryService.getById(request.categoryId());

        boolean isAbleOfMaterial = material.isAble();
        boolean isAbleOfCategory = category.isAble();

        if (!isAbleOfCategory)
            throw new RuntimeException("Phân loại vật liệu '" + category.getId() + "'" + " đã đóng");
        if (!isAbleOfMaterial)
            throw new RuntimeException("Vật liệu tiêu hao '" + material.getId() + "'" + " đã đóng");

        if (!material.getCategory().getId().equals(category.getId())) {
            throw new RuntimeException("Mã phân loại của vật liệu không khớp với dữ liệu thực");
        }

        request.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Tên vật liệu");
            if(materialRepository.existsByNameAndIdNot(name,request.id()))
                throw new RuntimeException("Đã tồn tại vật liệu '" + name + "'");
            material.setName(name);
        });
        request.unit().ifPresent(unit -> {
            FieldUtils.checkStrEmpty(unit, "Đơn vị");
            material.setUnit(unit);
        });
        request.quantity().ifPresent(quantity -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
            material.setQuantity(quantity);
        });
        request.func().ifPresent(func -> {
            FieldUtils.checkStrEmpty(func, "Chức năng");
            material.setFunc(func);
        });
        request.mfg_date().ifPresent(mfgDate -> {
            if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                throw new RuntimeException("Ngày sản xuất không được quá ngày hiện tại");
        });

//        Medicine

        request.cared_actor().ifPresent(actor -> {
            FieldUtils.checkStrEmpty(actor, "Đối tượng sử dụng");
            medicine.setCared_actor(actor);
        });

        request.instruction().ifPresent(ins -> {
            FieldUtils.checkStrEmpty(ins, "Hướng dẫn sử dụng");
            medicine.setInstruction(ins);
        });

        request.cost().ifPresent(cost -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(cost);
            medicine.setCost(cost);
        });

        request.revenue().ifPresent(revenue -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(revenue);
            medicine.setRevenue(revenue);
        });

        if(medicine.getRevenue() < medicine.getCost())
            throw new RuntimeException("Chi phí không được lớn hơn giá vật liệu");

        request.ingreIdList().ifPresent(ingreList -> {
            List<Ingredient> ingredientList =
                    ingredientService.getListIngredientByListId(ingreList);
            consumableMaterialService.updateIngredientForConMaterial
                    (ingredientList,material.getId());
        });


        Material m = materialRepository.save(material);
        ConsumableMaterial c = consumableMaterialService.getById(m.getId());
        List<Long> ingreIdList = new ArrayList<>();
        for(Ingredient i: c.getIngredientList()) {
            ingreIdList.add(i.getId());
        }

        return new MedicineUpdateRes(
                m.getId(),
                m.getCategoryId(),
                m.getName(),
                m.getFunc(),
                m.getUnit(),
                m.getMfg_date(),
                m.getQuantity(),
                ingreIdList,
                medicine.getCared_actor(),
                medicine.getRevenue(),
                medicine.getCost(),
                medicine.getInstruction()
        );
    }

    //    Kiểm tra able của material
    public boolean isAbleByMaterialId(Long id) {
        return getById(id).isAble();
    }

//    Thay đổi able của material
    public void toggleAbleMaterial(Long id) {
        Material m = getById(id);
        m.setAble(!m.isAble());
        materialRepository.save(m);
    }
}
