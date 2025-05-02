package com.dental_clinic.dentist_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.dentist_service.DTO.Request.CreateDentistReq;
import com.dental_clinic.dentist_service.DTO.Request.UpdateDentistReq;
import com.dental_clinic.dentist_service.Service.DentistService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/dentist")
@Validated
public class DentistController {

    private final DentistService dentistService;

    public DentistController(DentistService dentistService) {
        this.dentistService = dentistService;
    }

    @GetMapping("/{id}")
    public ApiResponse<Object> getDentistById(@PathVariable Long id) {
        return ApiResponse.builder()
                .message("Lấy thông tin nha sĩ thành công")
                .apiCode(HttpStatus.OK.value())
                .result(dentistService.findDentistById(id))
                .build();
    }

    @PostMapping("/create-dentist")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Object> createNewDentist(@Valid @RequestBody CreateDentistReq request) throws JsonProcessingException {
        return ApiResponse.builder()
                .message("Tạo nha sĩ mới thành công")
                .apiCode(HttpStatus.CREATED.value())
                .result(dentistService.createDentist(request)).build();
    }

    @PutMapping("/update-dentist")
    public ApiResponse<Object> updateFaculty(
            @Valid @RequestBody UpdateDentistReq request
    ) {
        return ApiResponse.builder()
                .message("Thay đổi nha sĩ thành công")
                .apiCode(HttpStatus.OK.value())
                .result(dentistService.updateDentist(request))
                .build() ;
    }
}
