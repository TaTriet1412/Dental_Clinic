package com.dental_clinic.patient_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.patient_service.DTO.Request.ChangePatientImageRequest;
import com.dental_clinic.patient_service.DTO.Request.CreatePatientReq;
import com.dental_clinic.patient_service.DTO.Request.UpdateLastVisted;
import com.dental_clinic.patient_service.DTO.Request.UpdatePatientReq;
import com.dental_clinic.patient_service.DTO.Response.NameIdPatientRes;
import com.dental_clinic.patient_service.DTO.Response.NamePatientRes;
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
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDate;
import java.util.List;
import java.util.Optional;

import static com.dental_clinic.patient_service.Utils.VariableUtils.DEFAULT_PATIENT_SERVICE;
import static com.dental_clinic.patient_service.Utils.VariableUtils.UPLOAD_DIR_PATIENT_SERVICE;

@Service
public class PatientService {
    PatientRepository patientRepository;

    @Autowired
    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    //    Lấy tất cả bệnh nhân
    public List<Patient> getAllPatients() {
        return patientRepository.findAll().stream()
                .sorted((p1, p2) -> p2.getCreated_at().compareTo(p1.getCreated_at()))
                .toList();
    }
    //    Tìm kiếm bệnh nhân theo id
    public Patient getById(String id) {
        return patientRepository.findById(id).orElseThrow(
                () -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy bệnh nhân có id = '" + id + "'"));
    }

    public NamePatientRes getNamePatientById(String id) {
        Patient patient = getById(id);
        return new NamePatientRes(patient.getName());
    }

    public List<NameIdPatientRes> getAllNameIdPatients() {
        return patientRepository.findAll().stream()
                .map(patient -> new NameIdPatientRes(patient.getId(), patient.getName()))
                .toList();
    }

    //    Tạo bệnh nhân
    public Patient createPatient(CreatePatientReq request) {
        if(patientRepository.existsByPhone(request.phone())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Số điện thoại đã tồn tại");
        }
        if(patientRepository.existsByEmail(request.email())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Email đã tồn tại");
        }

        Patient patient = Patient.builder()
                .created_at(LocalDateTime.now())
                .img(DEFAULT_PATIENT_SERVICE)
                .address(request.address())
                .email(request.email())
                .name(request.name())
                .gender(request.gender())
                .last_visit(null)
                .birthday(request.birthday())
                .phone(request.phone())
                .build();

        return patientRepository.save(patient);
    }

    //    Cập nhật thông tin bệnh nhân
    public Patient updatePatient(UpdatePatientReq request) {
        Patient patient = getById(request.id());

        request.name().ifPresent(name -> {
            if (name.isBlank())
                throw new AppException(ErrorCode.INVALID_REQUEST, "Tên không được để trống");
            patient.setName(name);
        });

        request.email().ifPresent(email -> {
            if (email.isBlank())
                throw new AppException(ErrorCode.INVALID_REQUEST, "Email không được để trống");
            if (patientRepository.existsByEmailAndIdNot(email, request.id()))
                throw new AppException(ErrorCode.EXISTED_DATA, "Email đã tồn tại");
            patient.setEmail(email);
        });

        request.phone().ifPresent(phone -> {
            if (phone.isBlank())
                throw new AppException(ErrorCode.INVALID_REQUEST, "Số điện thoại không được để trống");
            if (patientRepository.existsByPhoneAndIdNot(phone, request.id()))
                throw new AppException(ErrorCode.EXISTED_DATA, "Số điện thoại đã tồn tại");
            patient.setPhone(phone);
        });

        request.address().ifPresent(address -> {
            if (address.isBlank())
                throw new AppException(ErrorCode.INVALID_REQUEST, "Địa chỉ không được để trống");
            patient.setAddress(address);
        });

        request.birthday().ifPresent(birthday -> {
            if (birthday.isAfter(ChronoLocalDate.from(LocalDateTime.now())))
                throw new AppException(ErrorCode.INVALID_REQUEST, "Ngày sinh không hợp lệ");
            patient.setBirthday(birthday);
        });
        request.gender().ifPresent(patient::setGender);

        return patientRepository.save(patient);
    }

    //    Cập nhật thời gian khám gần nhất
    public Patient updateLastVisit(UpdateLastVisted request) {
        Patient patient = getById(request.id());
        patient.setLast_visit(request.last_visit());
        return patientRepository.save(patient);
    }

    //    Đổi ảnh cho bệnh nhân
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
            if (!patient.getImg().equals(DEFAULT_PATIENT_SERVICE)) {
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
                    .filter(img -> img != null && !img.equals(DEFAULT_PATIENT_SERVICE))
                    .toList();
            
            Path uploadDir = Path.of(UPLOAD_DIR_PATIENT_SERVICE);
            
            try {
                // Tạo thư mục nếu không tồn tại
                if (!Files.exists(uploadDir)) {
                    Files.createDirectories(uploadDir);
                    System.out.println(VariableUtils.getServerScanPrefix() + "Created upload directory: " + uploadDir);
                    return; // Không có file nào để scan
                }
                
                // Lấy danh sách tất cả các tệp trong thư mục uploads/patient_services
                List<Path> allFiles = Files.walk(uploadDir)
                        .filter(Files::isRegularFile)
                        .toList();

                // Xóa tệp trên server nếu không nằm trong listImgs
                for (Path file : allFiles) {
                    String fileName = uploadDir.relativize(file).toString().replace("\\", "/");
                    String fullPath = "patient_services/" + fileName;
                    
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
                System.err.println(VariableUtils.getServerScanPrefix() + "Error scanning patient service images: " + e.getMessage());
                e.printStackTrace();
            }
        }).start();
    }
}
