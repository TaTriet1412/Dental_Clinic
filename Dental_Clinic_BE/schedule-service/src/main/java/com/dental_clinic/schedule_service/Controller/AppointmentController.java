package com.dental_clinic.schedule_service.Controller;


import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.schedule_service.DTO.Request.CreateAppointmentReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointStatusReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointmentReq;
import com.dental_clinic.schedule_service.Entity.Appointment;
import com.dental_clinic.schedule_service.Service.AppointmentService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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

//    @GetMapping
//    public ApiResponse<Object> getAppointments(
//            @RequestParam Map<String, Object> filters,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size,
//            @RequestParam Map<String, String> sortFields) {
//        // Remove pagination parameters from filters
//        filters.remove("page");
//        filters.remove("size");
//        filters.remove("sortFields");
//
//        // Remove pagination parameters from sortFields
//        sortFields.remove("page");
//        sortFields.remove("size");
//        sortFields.remove("filters");
//
//        // Clean up and parse sortFields map
//        Map<String, Boolean> parsedSortFields = new HashMap<>();
//
//        // Extract raw sortFields value from the map
//        String rawSortFields = sortFields.get("sortFields"); // Get the "sortFields" value directly
//
//        if (rawSortFields != null && !rawSortFields.isEmpty()) {
//            // Split multiple sort field entries by comma
//            String[] fieldEntries = rawSortFields.split(",");
//
//            for (String fieldEntry : fieldEntries) {
//                // Split each entry into field name and sort direction using ":"
//                String[] keyValue = fieldEntry.split(":");
//
//                if (keyValue.length == 2) {
//                    String key = keyValue[0].trim(); // Extract the field name
//                    boolean value = Boolean.parseBoolean(keyValue[1].trim()); // Extract the sort direction
//                    parsedSortFields.put(key, value); // Add to parsed map
//                }
//            }
//        }
//
//        Map<String, Object> parsedFitersFields = new HashMap<>();
//
//        Object rawFilters = filters.get("filters");
//
//        if (rawFilters != null && rawFilters instanceof String rawFilterStr) {
//            // Parse chuỗi filters kiểu denId:1,status:CONFIRMED
//            String[] filterPairs = rawFilterStr.split(",");
//            for (String pair : filterPairs) {
//                String[] keyValue = pair.split(":");
//                if (keyValue.length == 2) {
//                    parsedFitersFields.put(keyValue[0].trim(), keyValue[1].trim());
//                }
//            }
//        }
//
//        // Log incoming parameters
//        System.out.println("ParsedFitersFields: " + parsedFitersFields);
//        System.out.println("Page: " + page);
//        System.out.println("Size: " + size);
//        System.out.println("ParsedSortFields: " + parsedSortFields);
//
//
//
//        return ApiResponse.builder()
//                .result(appointmentService.getFilteredAndSortedAppointments(parsedFitersFields, page, size, parsedSortFields))
//                .apiCode(200)
//                .message("Lấy lịch hẹn thành công")
//                .build();
//    }

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
    public ApiResponse<Object> createAppointment(@Valid @RequestBody CreateAppointmentReq req) throws MessagingException {
        return ApiResponse.builder()
                .result(appointmentService.createAppointment(req))
                .apiCode(200)
                .message("Tạo lịch hẹn thành công")
                .build();
    }

    @PutMapping("/update")
    public ApiResponse<Object> updateAppointment(@Valid @RequestBody UpdateAppointmentReq req) {
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
