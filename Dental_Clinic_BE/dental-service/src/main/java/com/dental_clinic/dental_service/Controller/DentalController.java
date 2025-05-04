package com.dental_clinic.dental_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.dental_service.DTO.Request.ChangeDentalServiceImageRequest;
import com.dental_clinic.dental_service.DTO.Request.CreateDentalServiceDTO;
import com.dental_clinic.dental_service.DTO.Request.UpdateDentalServiceDTO;
import com.dental_clinic.dental_service.Entity.Dental;
import com.dental_clinic.dental_service.Service.DentalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/dental/service")
@Validated
public class DentalController {
    private DentalService dentalService;

    @Autowired
    public DentalController(DentalService dentalService) {
        this.dentalService = dentalService;
    }

    @GetMapping
    public ApiResponse<Object> getAllDentalService() {
        List<Dental> dentals = dentalService.getAllDentalServices();
        return ApiResponse.builder()
                .result(dentals)
                .apiCode(200)
                .message("Lấy danh sách dịch vụ thành công!")
                .build();
    }

    @GetMapping("{id}")
    public ApiResponse<Object> getDentalById(@PathVariable String id) {
        return ApiResponse.builder()
                .result(dentalService.getById(id))
                .apiCode(200)
                .message("Lấy thông tin dịch vụ thành công!")
                .build();
    }

    @GetMapping("{id}/able")
    public ApiResponse<Object> getActiveDentalById(@PathVariable String id) {
        return ApiResponse.builder()
                .result(dentalService.getActiveDentalById(id))
                .apiCode(200)
                .message("Lấy thông tin dịch vụ thành công!")
                .build();
    }

    @GetMapping("{id}/price_cost")
    public ApiResponse<Object> getPriceCostOfDental(@PathVariable String id) {
        return ApiResponse.builder()
                .message("Lấy thông tin dịch vụ thành công!")
                .result(dentalService.getPriceCostDental(id))
                .apiCode(200)
                .build();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public ApiResponse<Object> createDentalService(@Valid @RequestBody CreateDentalServiceDTO createDentalServiceDTO) {
        return ApiResponse.builder()
                .result(dentalService.createDentalService(createDentalServiceDTO))
                .apiCode(HttpStatus.CREATED.value())
                .message("Tạo dịch vụ thành công!")
                .build();
    }

    @PutMapping(value = "/change-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Object> changeImg(@ModelAttribute ChangeDentalServiceImageRequest request) {
        dentalService.changeImg(request);
        return ApiResponse.builder()
                .message("Thay đổi ảnh thành công")
                .apiCode(200)
                .build();
    }

    @PutMapping("{id}")
    public ApiResponse<Object> updateDentalService(@Valid @RequestBody UpdateDentalServiceDTO req,
                                                   @PathVariable String id) {
        Dental dental = dentalService.updateDentalService(req, id);
        return ApiResponse.builder()
                .result(dental)
                .apiCode(200)
                .message("Cập nhật dịch vụ thành công!")
                .build();
    }

    @PatchMapping("{id}/able")
    public ApiResponse<Object> toggleAble(@PathVariable String id) {
        Dental dental = dentalService.toggleAble(id);
        return ApiResponse.builder()
                .apiCode(200)
                .message(dental.isAble() ?
                        "Đã mở dịch vụ" :
                        "Đã đóng dịch vụ")
                .build();
    }
}
