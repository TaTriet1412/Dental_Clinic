package com.dental_clinic.patient_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.patient_service.DTO.Request.ChangePatientImageRequest;
import com.dental_clinic.patient_service.Entity.Patient;
import com.dental_clinic.patient_service.Repository.PatientRepository;
import com.dental_clinic.patient_service.Utils.ImageUtils;
import com.dental_clinic.patient_service.Utils.VariableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {
    PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }



    //    Đổi ảnh cho dịch vụ
    public void changeImg(ChangePatientImageRequest request) {
        // Kiểm tra bệnh nhân tồn tại không
        Patient patient = patientRepository.findById(request.getPatientId()).orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Bệnh nhân không tồn tại"));
        // Kiểm tra file hợp lệ
        MultipartFile file = request.getImage();
        ImageUtils.checkImageFile(file);
        // Tạo thư mục upload nếu chưa tồn tại
        try {
            ImageUtils.createUploadDirIfNotExists(VariableUtils.TYPE_UPLOAD_PATIENT_SERVICE);
        } catch (IOException e) {
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Lỗi khi tạo thư mục upload: " + e.getMessage());
        }
        // Thực hiện thay đổi patient img
        try {
            // Lưu file vào server
            String fileName = ImageUtils.saveFileServer(file, VariableUtils.TYPE_UPLOAD_PATIENT_SERVICE);
            // Xóa file cũ
            if (!patient.getImg().equals(VariableUtils.DEFAULT_PATIENT_SERVICE)) {
                ImageUtils.deleteFileServer(patient.getImg());
            }
            // Cập nhật đường dẫn file mới vào database
            patient.setImg(fileName);
            patientRepository.save(patient);
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi lưu tập tin: " + e.getMessage());
        }
    }

    //    Scan và xóa hình ảnh không còn tham chiếu trong database
    public void SYSTEM_scanAndDeleteUnusedImgs() {
        new Thread(() -> {
            List<String> listImgs = patientRepository.findAllImg().stream()
                    .filter(img -> img != null && !img.equals(VariableUtils.DEFAULT_PATIENT_SERVICE))
                    .toList();
            Path uploadDir = Path.of(VariableUtils.UPLOAD_DIR_PATIENT_SERVICE);
            try {
                // Lấy danh sách tất cả các tệp trong thư mục uploads/patient_services
                List<Path> allFiles = Files.walk(uploadDir)
                        .filter(Files::isRegularFile) // Chỉ lấy các tệp, không lấy thư mục
                        .toList();

                // Xóa tệp trên server nếu không nằm trong listImgs
                for (Path file : allFiles) {
                    String fileName = file.getFileName().toString();
                    // Kiểm tra xem tệp có nằm trong listImgs không
                    if (!listImgs.contains(VariableUtils.UPLOAD_DIR_PATIENT_SERVICE_POSTFIX + fileName)) {
                        Files.delete(file);
                        System.out.println(VariableUtils.getServerScanPrefix() + "Delete unused patient img " + file);
                    }
                }

                // Đổi tệp trên database nếu không nằm trong server
                for (String img : listImgs) {
                    // An toàn hơn khi tách lấy tên file
                    String fileName = img.substring(img.lastIndexOf("/") + 1);
                    Path imgPath = uploadDir.resolve(fileName);

                    if (!Files.exists(imgPath)) {
                        Optional<Patient> patient = patientRepository.findByImg(img);
                        patient.ifPresent(d -> {
                            d.setImg(VariableUtils.DEFAULT_PATIENT_SERVICE);
                            patientRepository.save(d);
                            System.out.println(VariableUtils.getServerScanPrefix() +
                                    "Changed img of patient " + d.getId() + " to default in DB");
                        });
                    }
                }
                System.out.println(">>>\n" + VariableUtils.getServerStatPrefix() + "Scan and delete unused patient img completed\n<<<");

            } catch (IOException e) {
                e.printStackTrace();
            }
        }).start();
    }
}
