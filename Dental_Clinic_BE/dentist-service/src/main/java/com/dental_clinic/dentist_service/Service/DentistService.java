package com.dental_clinic.dentist_service.Service;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.dentist_service.Client.AccountClient;
import com.dental_clinic.dentist_service.DTO.Client.AccountCreateRes;
import com.dental_clinic.dentist_service.DTO.Request.CreateDentistReq;
import com.dental_clinic.dentist_service.DTO.Request.DeleteAccount;
import com.dental_clinic.dentist_service.DTO.Request.UpdateDentistReq;
import com.dental_clinic.dentist_service.Entity.Dentist;
import com.dental_clinic.dentist_service.Entity.Faculty;
import com.dental_clinic.dentist_service.Repository.DentistRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DentistService {
    final FacultyService facultyService;
    final AccountClient accountClient;
    final DentistRepository dentistRepository;
    final ObjectMapper objectMapper;
    private static final Logger logger = LoggerFactory.getLogger(DentistService.class);

    @Autowired
    public DentistService(FacultyService facultyService, AccountClient accountClient, DentistRepository dentistRepository, ObjectMapper objectMapper) {
        this.facultyService = facultyService;
        this.accountClient = accountClient;
        this.dentistRepository = dentistRepository;
        this.objectMapper = objectMapper;
    }


    private Dentist findById(Long dentistId) {
        return dentistRepository.findById(dentistId)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy nha sĩ"));
    }

    public Dentist createDentist(CreateDentistReq request) {
        AccountCreateRes accountCreateRes = null;
        try {
            // Gọi service tạo tài khoản
            ApiResponse<Object> accountResponse = accountClient.createAccount(request.account());

            if (accountResponse== null | accountResponse.getResult() == null) {
                throw new AppException(ErrorCode.valueOf(String.valueOf(accountResponse.getApiCode())), accountResponse.getMessage());
            }

            Object result =  accountResponse.getResult();
            accountCreateRes = objectMapper.convertValue(result, AccountCreateRes.class);

            // Gọi tiếp tạo dentist
            Faculty faculty = facultyService.findById(request.facId());
            checkAbleFaculty(request.facId());

            Dentist dentist = new Dentist();
            dentist.setSpecialty(request.specialty());
            dentist.setExperienceYear(request.expYear());
            dentist.setId(accountCreateRes.getId());
            dentist.setFaculty(faculty);

            dentistRepository.save(dentist);

            logger.info("Created new dentist: specialty={}, experience_year={}, fac_id={}",
                    dentist.getSpecialty(), dentist.getExperienceYear(), request.facId());

            return dentist;
        }
        catch (Exception ex) {
            DeleteAccount deleteAccount = new DeleteAccount(accountCreateRes.getEmail());
            accountClient.deleteAccount(deleteAccount);
            if (ex instanceof AppException ) {
                throw ex;
            }
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Tạo nha sĩ thất bại");
        }
    }

    private void checkAbleFaculty(Long facId) {
        if (!facultyService.isAbleFaculty(facId)) {
            throw new AppException(ErrorCode.DATA_OFF, "Khoa này đã ngưng hoạt động");
        }
    }

    public Dentist updateDentist(UpdateDentistReq request) {
        Dentist dentist = findById(request.dentistId());
        StringBuilder logMessage = new StringBuilder("Updated dentist id=" + request.dentistId() + ": ");
        boolean hasChanges = false;

        String oldSpecialty = dentist.getSpecialty();
        Integer oldExperienceYear = dentist.getExperienceYear();
        Long oldFacId = dentist.getFaculty() != null ? dentist.getFaculty().getId() : null;
        request.facId().ifPresent(facId -> {
            if(facId <= 0)
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Mã khoa không thể âm");
            Faculty faculty = facultyService.findById(facId);
            checkAbleFaculty(facId);
            dentist.setFaculty(faculty);
        });
        request.specialty().ifPresent(specialty -> {
            if (specialty.isBlank())
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA,"Chuyên môn không được rỗng");
            dentist.setSpecialty(specialty);
        });
        request.expYear().ifPresent(experienceYear -> {
            if(experienceYear <= 0)
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Năm kinh nghiệm không thể âm");
            dentist.setExperienceYear(experienceYear);
        });

        // Kiểm tra và ghi log các trường thay đổi
        Long newFacId = dentist.getFaculty() != null ? dentist.getFaculty().getId() : null;
        if (request.specialty().isPresent() && !dentist.getSpecialty().equals(oldSpecialty)) {
            logMessage.append("specialty from ").append(oldSpecialty).append(" to ").append(dentist.getSpecialty()).append("\n");
            hasChanges = true;
        }
        if (request.expYear().isPresent() && !dentist.getExperienceYear().equals(oldExperienceYear)) {
            logMessage.append("experience_year from ").append(oldExperienceYear).append(" to ").append(dentist.getExperienceYear()).append("\n");
            hasChanges = true;
        }
        if (request.facId().isPresent() && (oldFacId == null || !newFacId.equals(oldFacId))) {
            logMessage.append("fac_id from ").append(oldFacId).append(" to ").append(newFacId).append("\n");
            hasChanges = true;
        }

        if (hasChanges) {
            dentistRepository.save(dentist);
            logger.info(logMessage.toString());
        } else {
            dentistRepository.save(dentist);
        }

        return dentist;
    }

}
