package com.dental_clinic.dental_service.Service;

import com.dental_clinic.dental_service.DTO.ChangeDentalServiceImageRequest;
import com.dental_clinic.dental_service.DTO.CreateDentalServiceDTO;
import com.dental_clinic.dental_service.DTO.UpdateDentalServiceDTO;
import com.dental_clinic.dental_service.Entity.Dental;
import com.dental_clinic.dental_service.Repository.DentalRepository;
import com.dental_clinic.dental_service.Utils.FieldUtils;
import com.dental_clinic.dental_service.Utils.ImageUtils;
import com.dental_clinic.dental_service.Utils.VariableUtils;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import static com.dental_clinic.dental_service.Utils.VariableUtils.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class DentalService {
    private final DentalRepository dentalRepository;
    @Lazy
    private final CategoryService categoryService;

    @Autowired
    public DentalService(DentalRepository dentalRepository, CategoryService categoryService) {
        this.dentalRepository = dentalRepository;
        this.categoryService = categoryService;
    }

    public boolean isCategoryInUse(String id) {
        return dentalRepository.existsByCategoryId(id);
    }

    public List<Dental> getAllDentalServices() {
        return dentalRepository.findAll();
    }

    public Dental getById(String id) {
        return dentalRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy dịch vụ có id = '" + id + "'"));
    }

//    Đổi ảnh cho dịch vụ
    public void changeImg(ChangeDentalServiceImageRequest request) {
        // Kiểm tra dịch vụ tồn tại không
        Dental dental_service = dentalRepository.findById(request.getDentalServiceId()).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Dịch vụ không tồn tại"));
        // Kiểm tra file hợp lệ
        MultipartFile file = request.getImage();
        ImageUtils.checkImageFile(file);
        // Tạo thư mục upload nếu chưa tồn tại
        try {
            ImageUtils.createUploadDirIfNotExists(TYPE_UPLOAD_DENTAL_SERVICE);
        } catch (IOException e) {
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Lỗi khi tạo thư mục upload: " + e.getMessage());
        }
        // Thực hiện thay đổi dental service img
        try {
            // Lưu file vào server
            String fileName = ImageUtils.saveFileServer(file, TYPE_UPLOAD_DENTAL_SERVICE);
            // Xóa file cũ
            if (!dental_service.getImg().equals(VariableUtils.DEFAULT_DENTAL_SERVICE)) {
                ImageUtils.deleteFileServer(dental_service.getImg());
            }
            // Cập nhật đường dẫn file mới vào database
            dental_service.setImg(fileName);
            dentalRepository.save(dental_service);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu tập tin: " + e.getMessage());
        }
    }

    public Dental createDentalService(CreateDentalServiceDTO request) {
        if(request.getRevenue() < request.getCost())
            throw new AppException(ErrorCode.INVALID_REQUEST, "Chi phí không được lớn hơn giá sản phẩm");

        if (!categoryService.isAbleByCategoryId(request.getCategoryId()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Phân loại '" + request.getCategoryId() + "'" + " đã đóng");
        if (dentalRepository.existsByName(request.getName()))
            throw new AppException(ErrorCode.EXISTED_DATA, "Đã tồn tại dịch vụ '" + request.getName() + "'");

        categoryService.getById(request.getCategoryId());
        ObjectId categoryId = new ObjectId(request.getCategoryId());

        Dental dental = Dental.builder()
                .categoryId(categoryId)
                .created_at(LocalDateTime.now())
                .able(true)
                .name(request.getName())
                .revenue(request.getRevenue())
                .cost(request.getCost())
                .description(request.getDescription())
                .unit(request.getUnit())
                .cared_actor(request.getCared_actor())
                .img(DEFAULT_DENTAL_SERVICE)
                .build();

        return dentalRepository.save(dental);
    }

    public Dental updateDentalService(UpdateDentalServiceDTO req, String id) {
//        Lấy Dental cũ
        Dental dental = getById(id);

        req.getName().ifPresent(name -> {
            FieldUtils.checkFieldIsEmptyOrNull(name, "Tên dịch vụ");
            if (dentalRepository.existsByNameAndNameNot(name, id))
                throw new AppException(ErrorCode.EXISTED_DATA, "Đã tồn tại dịch vụ '" + name + "'");
            dental.setName(name);
        });

        req.getRevenue().ifPresent(revenue -> {
            FieldUtils.checkFieldIsEmptyOrNull(revenue, "Giá sản phẩm");
            FieldUtils.checkNumberIsIntegerAndNotNegative(revenue);
            dental.setRevenue(revenue);
        });

        req.getCost().ifPresent(cost -> {
            FieldUtils.checkFieldIsEmptyOrNull(cost, "Chi phí");
            FieldUtils.checkNumberIsIntegerAndNotNegative(cost);
            dental.setCost(cost);
        });

        req.getDescription().ifPresent(desc -> {
            FieldUtils.checkFieldIsEmptyOrNull(desc, "Mô tả");
            dental.setDescription(desc);
        });

        req.getUnit().ifPresent(unit -> {
            FieldUtils.checkFieldIsEmptyOrNull(unit, "Đơn vị");
            dental.setUnit(unit);
        });

        req.getCared_actor().ifPresent(actor -> {
            FieldUtils.checkFieldIsEmptyOrNull(actor, "Đối tượng chăm sóc");
            dental.setCared_actor(actor);
        });

        if(!categoryService.isAbleByCategoryId(id))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Phân loại '" + id + "'" + " đã đóng");
        if (dental.getRevenue() < dental.getCost())
            throw new AppException(ErrorCode.INVALID_REQUEST, "Chi phí không được lớn hơn giá sản phẩm");

        return dentalRepository.save(dental);
    }

    public Dental toggleAble(String id) {
        Dental dental = getById(id);
        dental.setAble(!dental.isAble());
        return dentalRepository.save(dental);
    }

    //    Kiểm tra able của dental
    public boolean isAbleByDentalId(String id) {
        return getById(id).isAble();
    }



    //    Scan và xóa hình ảnh không còn tham chiếu trong database
    public void SYSTEM_scanAndDeleteUnusedImgs() {
        new Thread(() -> {
            List<String> listImgs = dentalRepository.findAllImg().stream()
                    .filter(img -> img != null && !img.equals(DEFAULT_DENTAL_SERVICE))
                    .toList();
            Path uploadDir = Path.of(UPLOAD_DIR_DENTAL_SERVICE);
            try {
                // Lấy danh sách tất cả các tệp trong thư mục uploads/material_services
                List<Path> allFiles = Files.walk(uploadDir)
                        .filter(Files::isRegularFile) // Chỉ lấy các tệp, không lấy thư mục
                        .toList();

                // Xóa tệp trên server nếu không nằm trong listImgs
                for (Path file : allFiles) {
                    String fileName = file.getFileName().toString();
                    // Kiểm tra xem tệp có nằm trong listImgs không
                    if (!listImgs.contains(VariableUtils.UPLOAD_DIR_DENTAL_SERVICE_POSTFIX + fileName)) {
                        Files.delete(file);
                        System.out.println(VariableUtils.getServerScanPrefix() + "Delete unused material img " + file);
                    }
                }

                // Đổi tệp trên database nếu không nằm trong server
                for (String img : listImgs) {
                    // An toàn hơn khi tách lấy tên file
                    String fileName = img.substring(img.lastIndexOf("/") + 1);
                    Path imgPath = uploadDir.resolve(fileName);

                    if (!Files.exists(imgPath)) {
                        Optional<Dental> dental = dentalRepository.findByImg(img);
                        dental.ifPresent(d -> {
                            d.setImg(DEFAULT_DENTAL_SERVICE);
                            dentalRepository.save(d);
                            System.out.println(VariableUtils.getServerScanPrefix() +
                                    "Changed img of dental " + d.getId() + " to default in DB");
                        });
                    }
                }
                System.out.println(">>>\n" + VariableUtils.getServerStatPrefix() + "Scan and delete unused dental img completed\n<<<");

            } catch (IOException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
