package com.dental_clinic.patient_service.Controller;

import com.dental_clinic.patient_service.Utils.VariableUtils;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/patient/images")
public class ImagesController {

    private final Gson gson;

    @GetMapping()
    public ResponseEntity<Resource> getImage(@RequestParam String path) throws IOException {
        Path uploadDir = Paths.get(VariableUtils.UPLOAD_DIR_ROOT + "/");
        Path filePath = Paths.get(uploadDir.toString(), path);
        System.out.println(filePath);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            // Xác định Content-Type từ phần mở rộng tệp
            String contentType = Files.probeContentType(filePath);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path + "\"")
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/base64")
    public ResponseEntity<String> getImageBase64(@RequestParam String path) throws IOException {
        // Đường dẫn thư mục uploads
        Path uploadDir = Paths.get(VariableUtils.UPLOAD_DIR_ROOT + "/");
        Path filePath = Paths.get(uploadDir.toString(), path);

        // Kiểm tra file tồn tại và có thể đọc được
        if (Files.exists(filePath) && Files.isReadable(filePath)) {
            // Đọc toàn bộ nội dung tệp thành byte[]
            byte[] fileContent = Files.readAllBytes(filePath);

            // Encode nội dung file sang Base64
            String base64Content = Base64.getEncoder().encodeToString(fileContent);

            // Trả về Base64 trong response
            return ResponseEntity.ok()
                    .contentType(MediaType.TEXT_PLAIN) // Định dạng chuỗi text
                    .body(gson.toJson("data:image/png;base64," + base64Content));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(gson.toJson("Không tìm thấy tệp hoặc không thể đọc tệp"));
        }
    }

}
