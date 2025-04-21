package com.dental_clinic.dentist_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.dentist_service.DTO.Request.CreateFacultyReq;
import com.dental_clinic.dentist_service.DTO.Request.UpdateFacultyReq;
import com.dental_clinic.dentist_service.Service.FacultyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4HttpStatus.OK.value()")
@RequestMapping("/dentist/faculty")
@Validated
public class FacultyController {
    private final FacultyService facultyService;

    @Autowired
    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping
    public ApiResponse<Object> getAllFaculties() {
        return ApiResponse.builder()
                .message("Lấy danh sách thành công")
                .apiCode(HttpStatus.OK.value())
                .result(facultyService.getAllFaculties())
                .build() ;
    }

    @PostMapping("/create-faculty")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Object> createFaculty(
            @Valid @RequestBody CreateFacultyReq request
    ) {
        return ApiResponse.builder()
                .message("Tạo khoa thành công")
                .apiCode(HttpStatus.CREATED.value())
                .result(facultyService.createFaculty(request))
                .build() ;
    }

    @PutMapping("/update-faculty")
    public ApiResponse<Object> updateFaculty(
            @Valid @RequestBody UpdateFacultyReq request
    ) {
        return ApiResponse.builder()
                .message("Thay đổi thành công")
                .apiCode(HttpStatus.OK.value())
                .result(facultyService.updateFaculty(request))
                .build() ;
    }

    @PatchMapping("/{id}/toggle-able")
    public ApiResponse<Object> toggleAbleFaculty(@PathVariable Long id) {
        boolean able = facultyService.toggleAble(id);
        return ApiResponse.builder()
                .message("Thay đổi trạng thái khoa có" +
                         id +
                        " thành: " + (able ? "Đang hoạt động" : "Tạm ngưng"))
                .apiCode(HttpStatus.OK.value())
                .build();
    }
}
