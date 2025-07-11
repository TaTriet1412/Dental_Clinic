package com.dental_clinic.material_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.material_service.DTO.Request.ChangeMaterialServiceImageRequest;
import com.dental_clinic.material_service.DTO.Request.*;
import com.dental_clinic.material_service.DTO.Response.*;
import com.dental_clinic.material_service.Entity.*;
import com.dental_clinic.material_service.Repository.MaterialRepository;
import com.dental_clinic.material_service.Repository.MedicineRepository;
import com.dental_clinic.material_service.Utils.FieldUtils;
import com.dental_clinic.material_service.Utils.ImageUtils;
import com.dental_clinic.material_service.Utils.VariableUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.dental_clinic.material_service.Utils.VariableUtils.*;


@Service
public class MaterialService {
    private final MaterialRepository materialRepository;
    private final MedicineRepository medicineRepository;
    private final CategoryService categoryService;
    private final FixedMaterialService fixedMaterialService;
    private final ConsumableMaterialService consumableMaterialService;
    private final MedicineService medicineService;
    private final IngredientService ingredientService;

    @Autowired
    @Lazy
    public MaterialService(MaterialRepository materialRepository, MedicineRepository medicineRepository, CategoryService categoryService, FixedMaterialService fixedMaterialService, ConsumableMaterialService consumableMaterialService, MedicineService medicineService, IngredientService ingredientService) {
        this.materialRepository = materialRepository;
        this.medicineRepository = medicineRepository;
        this.categoryService = categoryService;
        this.fixedMaterialService = fixedMaterialService;
        this.consumableMaterialService = consumableMaterialService;
        this.medicineService = medicineService;
        this.ingredientService = ingredientService;
    }


    public boolean isCategoryInUse(Long id) {
        Category category = categoryService.getById(id);
        return materialRepository.existsByCategory(category);
    }

    public List<Material> getAllMaterialServices() {
        return materialRepository.findAll();
    }

    public Material getById(Long id) {
        return materialRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy vật liệu có id = '" + id + "'"));
    }

    //    Đổi ảnh cho vật liệu
    public void changeImg(ChangeMaterialServiceImageRequest request) {
        // Kiểm tra vật liệu tồn tại không
        Material material_service = materialRepository.findById(
                request.materialId()).orElseThrow(
                        () ->  new AppException(ErrorCode.NOT_FOUND,"Vật liệu không tồn tại"));
        // Kiểm tra file hợp lệ
        MultipartFile file = request.image();
        ImageUtils.checkImageFile(file);
        // Tạo thư mục upload nếu chưa tồn tại
        try {
            ImageUtils.createUploadDirIfNotExists(TYPE_UPLOAD_MATERIAL_SERVICE);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_ERROR,"Lỗi khi tạo thư mục upload: " + e.getMessage());
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
            throw new AppException(ErrorCode.FILE_ERROR,"Lỗi khi lưu tập tin: " + e.getMessage());
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
            throw new AppException(ErrorCode.DATA_OFF,"Phân loại '" + categoryId + "'" + " đã đóng");
        if (materialRepository.existsByName(name))
            throw new AppException(ErrorCode.EXISTED_DATA,"Đã tồn tại vật liệu '" + name + "'");

        if(FieldUtils.isLocalDateMoreThanToday(mfgDate)) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"Ngày sản xuất không được vượt quá hôm nay");
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

        Material savedMaterial = materialRepository.save(material);

        MaterialLog materialLog = MaterialLog.builder()
                .material(savedMaterial)
                .message("Tạo mới vật liệu. Nhập kho: +" + quantity + " , tổng " + quantity)
                .createdAt(LocalDateTime.now())
                .build();

        savedMaterial.getMaterialLogs().add(materialLog);

        savedMaterial = materialRepository.save(savedMaterial);

        return savedMaterial;
    }

// Tạo vật liệu cố định

    public FixedRes createFixedMaterial(CreateFixedMaterial request) {
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

        FixedMaterial fixedMaterial = fixedMaterialService.saveNewFixedMaterial(savedMaterial.getId());
        return new FixedRes(
                savedMaterial.getId(),
                savedMaterial.getName(),
                savedMaterial.getQuantity(),
                savedMaterial.getUnit(),
                savedMaterial.getCreated_at(),
                savedMaterial.getMfg_date(),
                savedMaterial.isAble(),
                savedMaterial.getFunc(),
                savedMaterial.getCategory().getId(),
                savedMaterial.getImg()
        );
    }

//    Tạo vật liệu tiêu hao (không phải thuốc)
    public ConsumableRes createConsumableMaterial(CreateConsumableMaterial request) {
        validateCreateMaterialRequest(
                request.categoryId(),
                request.name(),
                request.unit(),
                request.quantity(),
                request.mfg_date(),
                request.func()
        );

        List<Ingredient> ingredientList = ingredientService.getListIngredientByListIdHasAble(request.ingreIdList());

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
        return new ConsumableRes(
                savedMaterial.getId(),
                savedMaterial.getName(),
                savedMaterial.getQuantity(),
                savedMaterial.getUnit(),
                savedMaterial.getCreated_at(),
                savedMaterial.getMfg_date(),
                savedMaterial.isAble(),
                savedMaterial.getFunc(),
                consumableMaterial.getIngredientList().stream().map(Ingredient::getId).collect(Collectors.toList()),
                savedMaterial.getCategoryId(),
                savedMaterial.getImg()
        );
    }

//    Tạo vật liệu tiêu hao (là thuốc)
    public MedicineRes createMedicine(CreateMedicine request) {
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
        FieldUtils.checkFieldIsEmptyOrNull(request.price(),"Giá");
        FieldUtils.checkFieldIsEmptyOrNull(request.cost(),"Chi phí");


        FieldUtils.checkNumberIsIntegerAndNotNegative(request.price());
        FieldUtils.checkNumberIsIntegerAndNotNegative(request.cost());

        if(request.price() < request.cost())
            throw new AppException(ErrorCode.INVALID_REQUEST,"Chi phí không được lớn hơn giá vật liệu");


        List<Ingredient> ingredientList = ingredientService.getListIngredientByListIdHasAble(request.ingreIdList());

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

        Medicine medicine = medicineRepository.save(
                Medicine.builder()
                        .id(savedMaterial.getId())
                        .cost(request.cost())
                        .price(request.price())
                        .instruction(request.instruction())
                        .cared_actor(request.cared_actor())
                        .build()
        );

        return new MedicineRes(
                savedMaterial.getId(),
                savedMaterial.getName(),
                savedMaterial.getQuantity(),
                savedMaterial.getUnit(),
                savedMaterial.getMfg_date(),
                savedMaterial.isAble(),
                medicine.getPrice(),
                medicine.getCost(),
                medicine.getInstruction(),
                medicine.getCared_actor(),
                request.ingreIdList(),
                savedMaterial.getFunc(),
                savedMaterial.getCategoryId(),
                savedMaterial.getImg(),
                savedMaterial.getCreated_at()
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
            throw new AppException(ErrorCode.DATA_OFF,"Phân loại vật liệu '" + category.getId() + "'" + " đã đóng");
        if (!isAbleOfMaterial)
            throw new AppException(ErrorCode.DATA_OFF,"Vật liệu tiêu hao '" + material.getId() + "'" + " đã đóng");

        material.setCategory(category);


        request.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Tên vật liệu");
            if(materialRepository.existsByNameAndIdNot(name,request.id()))
                throw new AppException(ErrorCode.EXISTED_DATA,"Đã tồn tại vật liệu '" + name + "'");
            material.setName(name);
        });
        request.unit().ifPresent(unit -> {
            FieldUtils.checkStrEmpty(unit, "Đơn vị");
            material.setUnit(unit);
        });
        request.quantity().ifPresent(quantity -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
            MaterialLog materialLog = MaterialLog.builder()
                    .createdAt(LocalDateTime.now())
                    .material(material)
                    .message("Thay đổi số lượng vật liệu. Số lượng mới: " + quantity + " , tổng " + quantity)
                    .build();
            material.setQuantity(quantity);
            material.getMaterialLogs().add(materialLog);
        });
        request.func().ifPresent(func -> {
            FieldUtils.checkStrEmpty(func, "Chức năng");
            material.setFunc(func);
        });
        request.mfg_date().ifPresent(mfgDate -> {
            if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                throw new AppException(ErrorCode.INVALID_REQUEST,"Ngày sản xuất không được quá ngày hiện tại");
            material.setMfg_date(mfgDate);
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
            throw new AppException(ErrorCode.DATA_OFF,"Phân loại vật liệu '" + category.getId() + "'" + " đã đóng");
        if (!isAbleOfMaterial)
            throw new AppException(ErrorCode.DATA_OFF,"Vật liệu tiêu hao '" + material.getId() + "'" + " đã đóng");
        if(medicineService.isMedicine(material.getId()))
            throw new AppException(ErrorCode.INVALID_REQUEST,"Chỉ hỗ trợ vật liệu tiêu hao không phải thuốc");


        if (!material.getCategory().getId().equals(category.getId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"Mã phân loại của vật liệu không khớp với dữ liệu thực");
        }

        request.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Tên vật liệu");
            if(materialRepository.existsByNameAndIdNot(name,request.id()))
                throw new AppException(ErrorCode.EXISTED_DATA,"Đã tồn tại vật liệu '" + name + "'");
            material.setName(name);
        });
        request.unit().ifPresent(unit -> {
            FieldUtils.checkStrEmpty(unit, "Đơn vị");
            material.setUnit(unit);
        });
        request.quantity().ifPresent(quantity -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
            MaterialLog materialLog = MaterialLog.builder()
                    .createdAt(LocalDateTime.now())
                    .material(material)
                    .message("Thay đổi số lượng vật liệu. Số lượng mới: " + quantity + " , tổng " + quantity)
                    .build();
            material.setQuantity(quantity);
            material.getMaterialLogs().add(materialLog);
        });
        request.func().ifPresent(func -> {
            FieldUtils.checkStrEmpty(func, "Chức năng");
            material.setFunc(func);
        });
        request.mfg_date().ifPresent(mfgDate -> {
            if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                throw new AppException(ErrorCode.INVALID_REQUEST,"Ngày sản xuất không được quá ngày hiện tại");
            material.setMfg_date(mfgDate);
        });

        request.ingreIdList().ifPresent(ingreList -> {
            List<Ingredient> ingredientList =
                    ingredientService.getListIngredientByListIdHasAble(ingreList);
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
            throw new AppException(ErrorCode.DATA_OFF,"Phân loại vật liệu '" + category.getId() + "'" + " đã đóng");
        if (!isAbleOfMaterial)
            throw new AppException(ErrorCode.DATA_OFF,"Vật liệu tiêu hao '" + material.getId() + "'" + " đã đóng");

        if (!material.getCategory().getId().equals(category.getId())) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"Mã phân loại của vật liệu không khớp với dữ liệu thực");
        }

        request.name().ifPresent(name -> {
            FieldUtils.checkStrEmpty(name, "Tên vật liệu");
            if(materialRepository.existsByNameAndIdNot(name,request.id()))
                throw new AppException(ErrorCode.EXISTED_DATA,"Đã tồn tại vật liệu '" + name + "'");
            material.setName(name);
        });
        request.unit().ifPresent(unit -> {
            FieldUtils.checkStrEmpty(unit, "Đơn vị");
            material.setUnit(unit);
        });
        request.quantity().ifPresent(quantity -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(quantity);
            MaterialLog materialLog = MaterialLog.builder()
                    .createdAt(LocalDateTime.now())
                    .message("Thay đổi số lượng vật liệu. Số lượng mới: " + quantity + " , tổng " + quantity)
                    .material(material)
                    .build();
            material.setQuantity(quantity);
            material.getMaterialLogs().add(materialLog);
        });
        request.func().ifPresent(func -> {
            FieldUtils.checkStrEmpty(func, "Chức năng");
            material.setFunc(func);
        });
        request.mfg_date().ifPresent(mfgDate -> {
            if(FieldUtils.isLocalDateMoreThanToday(mfgDate))
                throw new AppException(ErrorCode.INVALID_REQUEST,"Ngày sản xuất không được quá ngày hiện tại");
            material.setMfg_date(mfgDate);
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

        request.price().ifPresent(price -> {
            FieldUtils.checkNumberIsIntegerAndNotNegative(price);
            medicine.setPrice(price);
        });

        if(medicine.getPrice() < medicine.getCost())
            throw new AppException(ErrorCode.INVALID_REQUEST,"Chi phí không được lớn hơn giá vật liệu");

        request.ingreIdList().ifPresent(ingreList -> {
            List<Ingredient> ingredientList =
                    ingredientService.getListIngredientByListIdHasAble(ingreList);
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
                medicine.getPrice(),
                medicine.getCost(),
                medicine.getInstruction()
        );
    }

    //    Kiểm tra able của material
    public boolean isAbleByMaterialId(Long id) {
        return getById(id).isAble();
    }

//    Thay đổi able của material
    public Material toggleAbleMaterial(Long id) {
        Material m = getById(id);
        m.setAble(!m.isAble());
        MaterialLog materialLog = MaterialLog.builder()
                .createdAt(LocalDateTime.now())
                .message("Thay đổi trạng thái vật liệu. Trạng thái mới: " +
                        (m.isAble() ? "Đang hoạt động" : "Không hoạt động"))
                .material(m)
                .build();
        m.getMaterialLogs().add(materialLog);
        return materialRepository.save(m);
    }

//    Scan và xóa hình ảnh không còn tham chiếu trong database
    public void SYSTEM_scanAndDeleteUnusedImgs() {
        new Thread(() -> {
            List<String> listImgs = materialRepository.findAllImg().stream()
                    .filter(img -> img != null && !img.equals(DEFAULT_MATERIAL))
                    .toList();
            
            Path uploadDir = Path.of(UPLOAD_DIR_MATERIAL_SERVICE);
            
            try {
                // Tạo thư mục nếu không tồn tại
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    System.out.println(VariableUtils.getServerScanPrefix() + "Created upload directory: " + uploadDir);
                    return; // Không có file nào để scan
                }
                
                // Lấy danh sách tất cả các tệp trong thư mục uploads/material_services
                List<Path> allFiles = Files.walk(uploadDir)
                        .filter(Files::isRegularFile)
                        .toList();

                // Xóa tệp trên server nếu không nằm trong listImgs
                for (Path file : allFiles) {
                    String fileName = uploadDir.relativize(file).toString().replace("\\", "/");
                    String fullPath = "material_services/" + fileName;
                    
                    if (!listImgs.contains(fullPath)) {
                        try {
                            Files.delete(file);
                            System.out.println(VariableUtils.getServerScanPrefix() + "Deleted unused file: " + fileName);
                        } catch (IOException e) {
                            System.err.println(VariableUtils.getServerScanPrefix() + "Failed to delete file: " + fileName + " - " + e.getMessage());
                        }
                    }
                }
                
                System.out.println(VariableUtils.getServerScanPrefix() + "Scan completed successfully");
            } catch (IOException e) {
                System.err.println(VariableUtils.getServerScanPrefix() + "Error scanning material service images: " + e.getMessage());
                e.printStackTrace();
            }
        }).start();
    }

    @Transactional
    public void updateQuantityOfListMaterial(InfoChangeQuantityMaterialReq req) {
        String userInfo = req.actorName() + " - " + req.userId();
        for(UpdateQuantityMaterialReq r: req.updateQuantityMaterialReqs()) {
            Material m = getById(r.id());
            Integer Sum = m.getQuantity() + r.quantity();
            if(Sum < 0)
                throw new AppException(ErrorCode.INVALID_REQUEST,"Số lượng vật liệu '" + m.getName() + "' không đủ");
            MaterialLog materialLog = MaterialLog.builder()
                    .createdAt(LocalDateTime.now())
                    .message("Thay đổi số lượng vật liệu vì toa thuốc. Số lượng cũ: " + m.getQuantity() + " , mới: " + Sum + " . Người thực hiện: " + userInfo)
                    .material(m)
                    .build();
            m.getMaterialLogs().add(materialLog);
            m.setQuantity(Sum);
            materialRepository.save(m);
        }
    }


    public List<MaterialLog> getListLogOfMaterialById(Long id) {
        Material material = getById(id);
        if (material.getMaterialLogs() == null) {
            return new ArrayList<>();
        }
        return new ArrayList<>(material.getMaterialLogs());
    }
}
