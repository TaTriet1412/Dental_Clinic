package com.dental_clinic.patient_service.Utils;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

public class ImageUtils {

    public static String saveFileServer(MultipartFile file, int uploadType) throws IOException {
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        // Kiểm tra tên file
        if (fileName.contains("..")) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"tên tập tin chứa ký tự không hợp lệ");
        }
        // Kiểm tra tên file rỗng
        if (fileName.isBlank()) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"Tên tập tin rỗng");
        }
        // Tạo tên file mới để tránh trùng lặp
        String uniqueFileName = VariableUtils.getStringFromUploadType(uploadType) + "/" + UUID.randomUUID() + fileName.substring(fileName.lastIndexOf("."));
        // Lấy đường dẫn đầy đủ đến file
        Path filePath = Paths.get(VariableUtils.UPLOAD_DIR_ROOT, uniqueFileName);
        // Lưu file vào thư mục uploads
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return uniqueFileName;
    }

    public static void deleteFileServer(String fileName) throws IOException {
        if(fileName.isBlank()) return;
        Path uploadDir = Paths.get("../patient-service/uploads");
        Path filePath = Paths.get(uploadDir.toString(), fileName);
        Files.deleteIfExists(filePath);
    }

    public static void checkImageFile(MultipartFile file) {
        // Kiểm tra file rỗng
        if (file == null) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"Tập tin không tồn tại");
        }
        // Kiểm tra kích thước file (nax 5MB)
        if(file.getSize() > 5*1024*1024) {
            throw new AppException(ErrorCode.INVALID_REQUEST,"Tập tin quá lớn. Kích thước tối đa là 5MB");
        }
        // Kiểm tra content type
        String contentType = file.getContentType();
        if(contentType == null || !contentType.startsWith("image/")){
            throw new AppException(ErrorCode.INVALID_REQUEST,"Tập tin không phải là hình ảnh");
        }
    }

    public static void createUploadDirIfNotExists(int uploadType) throws IOException {
        Path uploadDir = Paths.get(VariableUtils.UPLOAD_DIR_ROOT, VariableUtils.getStringFromUploadType(uploadType));
        if (!Files.exists(uploadDir)) {
            if(!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }
        }
    }
}