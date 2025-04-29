package com.dental_clinic.schedule_service.Controller;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.schedule_service.DTO.Request.CreateWorkScheduleReq;
import com.dental_clinic.schedule_service.DTO.Request.ScheduleRangeTimeReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateWorkScheduleReq;
import com.dental_clinic.schedule_service.Service.WorkScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/schedule/work-schedule")
@Validated
public class WorkScheduleController {
    WorkScheduleService workScheduleService;

    @Autowired
    public WorkScheduleController(WorkScheduleService workScheduleService) {
        this.workScheduleService = workScheduleService;
    }

    //    Lấy lịch làm việc của người dùng
    @GetMapping("/user/{user_id}")
    public ApiResponse<Object> getWorkSchedulesByUserId(@PathVariable Long user_id) {
        return ApiResponse.builder()
                .message("Lấy lịch làm việc của người dùng thành công")
                .apiCode(200)
                .result(workScheduleService.getWorkSchedulesByUserId(user_id))
                .build();
    }

    //    Lấy lịch làm việc theo khoảng thời gian
    @PostMapping("/user/time-start-between")
    public ApiResponse<Object> getAllWorkSchedulesByUserIdAndTimeStartBetween(@Valid @RequestBody ScheduleRangeTimeReq req) {
        return ApiResponse.builder()
                .message("Lấy lịch làm việc theo khoảng thời gian thành công")
                .apiCode(200)
                .result(workScheduleService.getAllWorkSchedulesByUserIdAndTimeStartBetween(req))
                .build();
    }

    //    Tạo lịch làm việc
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public ApiResponse<Object> createWorkSchedule(@Valid @RequestBody CreateWorkScheduleReq req) {
        return ApiResponse.builder()
                .message("Tạo lịch làm việc thành công")
                .apiCode(200)
                .result(workScheduleService.createWorkSchedule(req))
                .build();
    }

    //    Cập nhật lịch làm việc
    @PutMapping("/update")
    public ApiResponse<Object> updateWorkSchedule(@Valid @RequestBody UpdateWorkScheduleReq req) {
        return ApiResponse.builder()
                .message("Cập nhật lịch làm việc thành công")
                .apiCode(200)
                .result(workScheduleService.updateWorkSchedule(req))
                .build();
    }

    //    Xóa lịch làm việc
    @DeleteMapping("/delete/{id}")
    public ApiResponse<Object> deleteWorkSchedule(@PathVariable String id) {
        workScheduleService.deleteWorkSchedule(id);
        return ApiResponse.builder()
                .message("Xóa lịch làm việc thành công")
                .apiCode(200)
                .build();
    }
}
