package com.dental_clinic.schedule_service.Controller;


import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.schedule_service.DTO.Request.CreateAppointmentReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointStatusReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointmentReq;
import com.dental_clinic.schedule_service.Entity.Appointment;
import com.dental_clinic.schedule_service.Service.AppointmentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/schedule/appointment")
@Validated
public class AppointmentController {
    AppointmentService appointmentService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/pagination")
    public ApiResponse<Object> getPaginationAppointments(
            @RequestParam(required = false) String filters,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sortFields) {
        try {
            Page<Appointment> result = appointmentService.getPaginationAppointments(filters, page, size, sortFields);

            return ApiResponse.builder()
                    .apiCode(200)
                    .message("Lấy danh sách lịch hẹn phân trang thành công")
                    .result(result)
                    .build();
        } catch (Exception e) {
            return ApiResponse.builder()
                    .apiCode(400)
                    .message("Lỗi khi lấy danh sách lịch hẹn: " + e.getMessage())
                    .result(null)
                    .build();
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<Object> getAppointmentById(@PathVariable String id) {
        return ApiResponse.builder()
                .result(appointmentService.getAppointmentById(id))
                .apiCode(200)
                .message("Lấy lịch hẹn thành công")
                .build();
    }

    @GetMapping("/dentist/{denId}")
    public ApiResponse<Object> getAppointmentsByDenId(@PathVariable Long denId) {
        List<Appointment> appointments = appointmentService.getAppointmentsByDenId(denId);
        return ApiResponse.builder()
                .result(appointments)
                .apiCode(200)
                .message("Lấy lịch hẹn thành công")
                .build();
    }

    @GetMapping
    public ApiResponse<Object> getAppointments() {
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ApiResponse.builder()
                .result(appointments)
                .apiCode(200)
                .message("Lấy lịch hẹn thành công")
                .build();
    }

    @ResponseStatus( HttpStatus.CREATED)
    @PostMapping("/create")
    public ApiResponse<Object> createAppointment(@Valid @RequestBody CreateAppointmentReq req) throws MessagingException, JsonProcessingException {
        return ApiResponse.builder()
                .result(appointmentService.createAppointment(req))
                .apiCode(200)
                .message("Tạo lịch hẹn thành công")
                .build();
    }

    @PutMapping("/update")
    public ApiResponse<Object> updateAppointment(@Valid @RequestBody UpdateAppointmentReq req) throws JsonProcessingException {
        return ApiResponse.builder()
                .result(appointmentService.updateAppointment(req))
                .apiCode(200)
                .message("Cập nhật lịch hẹn thành công")
                .build();
    }

    @PutMapping("/update-status")
    public ApiResponse<Object> updateAppointmentStatus(@Valid @RequestBody UpdateAppointStatusReq req) {
        appointmentService.changeStatusAppointment(req);
        return ApiResponse.builder()
                .apiCode(200)
                .message("Cập nhật trạng thái lịch hẹn thành công")
                .build();
    }
}
