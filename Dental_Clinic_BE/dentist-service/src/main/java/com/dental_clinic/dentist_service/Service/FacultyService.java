package com.dental_clinic.dentist_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.common_lib.support_method.EmailSupport;
import com.dental_clinic.dentist_service.DTO.Request.CreateFacultyReq;
import com.dental_clinic.dentist_service.DTO.Request.UpdateFacultyReq;
import com.dental_clinic.dentist_service.Entity.Faculty;
import com.dental_clinic.dentist_service.Repository.FacultyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FacultyService {
    private final FacultyRepository facultyRepository;

    @Autowired
    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public Faculty findById(Long id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy khoa có id = " + id));
    }

    public boolean isAbleFaculty(Long id) {
        Faculty faculty = findById(id);
        return faculty.getAble();
    }

    public Faculty createFaculty(CreateFacultyReq req) {

        if (facultyRepository.existsByName(req.name())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Tên khoa đã tồn tại");
        }
        if (facultyRepository.existsByEmail(req.email())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Email đã tồn tại");
        }
        if (facultyRepository.existsByPhoneNumber(req.phoneNumber())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Số điện thoại đã tồn tại");
        }

        Faculty faculty = new Faculty();
        faculty.setName(req.name());
        faculty.setDescription(req.description());
        faculty.setAble(true);
        faculty.setEmail(req.email());
        faculty.setPhoneNumber(req.phoneNumber());
        faculty.setCreatedAt(LocalDateTime.now());

        facultyRepository.save(faculty);

        return faculty;
    }

    public Faculty updateFaculty(UpdateFacultyReq req) {
        Faculty faculty = findById(req.facultyId());

        StringBuilder logMessage = new StringBuilder("Updated faculty id=" + req.facultyId() + ": ");
        boolean hasChanges = false;

        String oldName = faculty.getName();
        String oldDescription = faculty.getDescription();
        String oldEmail = faculty.getEmail();
        String oldPhoneNumber = faculty.getPhoneNumber();

        req.name().ifPresent(name -> {
            if(name.isBlank())
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Tên khoa không được để trống");
            if (facultyRepository.existsByNameAndIdNot(name, req.facultyId()))
                throw new AppException(ErrorCode.EXISTED_DATA, "Tên khoa đã tồn tại");
            faculty.setName(name);
        });
        req.email().ifPresent(email -> {
            if (email.isBlank()) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Email không được để trống");
            }
            if (!EmailSupport.isEmail(email)) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Email không đúng định dạng");
            }
            if (facultyRepository.existsByEmailAndIdNot(email.trim(), req.facultyId())) {
                throw new AppException(ErrorCode.EXISTED_DATA, "Email đã tồn tại");
            }
            faculty.setEmail(email);
        });

        req.phoneNumber().ifPresent(phoneNumber -> {
            if(phoneNumber.isBlank())
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Số điện thoại không được để trống");
            if (facultyRepository.existsByPhoneNumberAndIdNot(phoneNumber, req.facultyId())) {
                throw new AppException(ErrorCode.EXISTED_DATA, "Số điện thoại đã tồn tại");
            }
            faculty.setPhoneNumber(phoneNumber);
        });

        req.description().ifPresent(faculty::setDescription);

        // Kiểm tra và ghi log các trường thay đổi
        if (req.name().isPresent() && !faculty.getName().equals(oldName)) {
            logMessage.append("name from ").append(oldName).append(" to ").append(faculty.getName()).append("\n");
            hasChanges = true;
        }
        if (req.description().isPresent() && !faculty.getDescription().equals(oldDescription)) {
            logMessage.append("description from ").append(oldDescription).append(" to ").append(faculty.getDescription()).append("\n");
            hasChanges = true;
        }
        if (req.email().isPresent() && !faculty.getEmail().equals(oldEmail)) {
            logMessage.append("email from ").append(oldEmail).append(" to ").append(faculty.getEmail()).append("\n");
            hasChanges = true;
        }
        if (req.phoneNumber().isPresent() && !faculty.getPhoneNumber().equals(oldPhoneNumber)) {
            logMessage.append("phone_number from ").append(oldPhoneNumber).append(" to ").append(faculty.getPhoneNumber()).append("\n");
            hasChanges = true;
        }

        facultyRepository.save(faculty);

        return faculty;
    }

    public boolean toggleAble(Long id) {
        Faculty faculty = findById(id);
        faculty.setAble(!faculty.getAble());
        return facultyRepository.save(faculty).getAble();
    }

    public List<Faculty> getAllFaculties() {
        return facultyRepository.findAll();
    }
}
