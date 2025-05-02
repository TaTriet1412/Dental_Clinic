package com.dental_clinic.schedule_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.schedule_service.DTO.Request.CreateWorkScheduleReq;
import com.dental_clinic.schedule_service.DTO.Request.ScheduleRangeTimeReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateWorkScheduleReq;
import com.dental_clinic.schedule_service.DTO.Response.EventRes;
import com.dental_clinic.schedule_service.Entity.Appointment;
import com.dental_clinic.schedule_service.Entity.WorkSchedule;
import com.dental_clinic.schedule_service.Repository.WorkScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class WorkScheduleService {
    private final AppointmentService appointmentService;
    WorkScheduleRepository workScheduleRepository;

    @Autowired
    @Lazy
    public WorkScheduleService(WorkScheduleRepository workScheduleRepository , AppointmentService appointmentService) {
        this.workScheduleRepository = workScheduleRepository;
        this.appointmentService = appointmentService;
    }

    public List<WorkSchedule> getAllWorkSchedules(){
        return workScheduleRepository.findAll();
    }

    public WorkSchedule getWorkScheduleById(String id){
        return workScheduleRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy lịch làm việc có id = '" + id + "'"));
    }

    public List<WorkSchedule> getWorkSchedulesByUserId(Long user_id){
        return workScheduleRepository.findAllByUserId(user_id);
    }

    public WorkSchedule createWorkSchedule(CreateWorkScheduleReq req){
        if(req.startTime().isEqual(req.endTime()) || req.startTime().isAfter(req.endTime()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải trước thời gian kết thúc");

        boolean isConflict = workScheduleRepository.findAllByUserId(req.userId()).stream()
                .anyMatch(existing ->
                        !(req.endTime().isEqual(existing.getTimeStart()) || req.endTime().isBefore(existing.getTimeStart())) &&
                                !(req.startTime().isEqual(existing.getTimeEnd()) || req.startTime().isAfter(existing.getTimeEnd()))
                );
        if (isConflict) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch làm việc khác");
        }

        return workScheduleRepository.save(WorkSchedule.builder()
                .userId(req.userId())
                .timeStart(req.startTime())
                .timeEnd(req.endTime())
                .build());
    }

    public List<EventRes> getAllWorkSchedulesByUserIdAndTimeStartBetween(ScheduleRangeTimeReq req){
        return workScheduleRepository.findAllByUserIdAndTimeStartBetween(req.userId(),req.startTime(), req.endTime()).stream()
                .map(existing -> new EventRes(existing.getId(),existing.getTimeStart(), existing.getTimeEnd()))
                .toList();
    }

    public WorkSchedule updateWorkSchedule(UpdateWorkScheduleReq req){
        WorkSchedule workSchedule = getWorkScheduleById(req.id());

        if(req.startTime().isEqual(req.endTime()) || req.startTime().isAfter(req.endTime()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải trước thời gian kết thúc");

        checkRemoveWorkScheduleInPast(workSchedule);

        Map<String, LocalDateTime> appointLimitTimeRangeDentist = appointmentService.getAppointmentTimeRange(
                workSchedule.getUserId(),
                workSchedule.getTimeStart(),
                workSchedule.getTimeEnd()
        );

        if (!appointLimitTimeRangeDentist.isEmpty()) {
            LocalDateTime startTime = appointLimitTimeRangeDentist.get("earliestStartTime");
            LocalDateTime endTime = appointLimitTimeRangeDentist.get("latestEndTime");
            if(!((req.startTime().isBefore(startTime) || req.startTime().isEqual(startTime))
                    && (req.endTime().isAfter(endTime) || req.endTime().isEqual(endTime))))
                throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian làm việc không được nằm ngoài khoảng thời gian đã đặt lịch hẹn" +
                        " từ " + startTime + " đến " + endTime + " của bác sĩ");
        }

        boolean isConflict = workScheduleRepository.findAllByUserIdAndIdNot(workSchedule.getUserId(),req.id()).stream()
                .anyMatch(existing ->
                        !(req.endTime().isEqual(existing.getTimeStart()) || req.endTime().isBefore(existing.getTimeStart())) &&
                                !(req.startTime().isEqual(existing.getTimeEnd()) || req.startTime().isAfter(existing.getTimeEnd()))
                );
        if (isConflict) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch làm việc khác");
        }

        workSchedule.setTimeStart(req.startTime());
        workSchedule.setTimeEnd(req.endTime());
        return workScheduleRepository.save(workSchedule);
    }

    public void deleteWorkSchedule(String id){
        WorkSchedule workSchedule = getWorkScheduleById(id);
        checkRemoveWorkScheduleInPast(workSchedule);

        List<Appointment> appointments = appointmentService.getFilteredAppointmentsInReqRange(workSchedule.getUserId(),
                workSchedule.getTimeStart(), workSchedule.getTimeEnd());
        if (!appointments.isEmpty())
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể xóa lịch làm việc vì có lịch hẹn trong khoảng thời gian này");
        workScheduleRepository.delete(workSchedule);
    }

    private static void checkRemoveWorkScheduleInPast(WorkSchedule workSchedule) {
        if (workSchedule.getTimeStart().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể thay đổi lịch làm việc có thời gian bắt đầu đã qua hiện tại");
        }
    }

    public boolean isTimeRangeInWorkSchedule(Long userId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<WorkSchedule> userSchedules = getWorkSchedulesByUserId(userId);

        return userSchedules.stream()
                .anyMatch(existing ->
                        (timeStart.isAfter(existing.getTimeStart()) || timeStart.isEqual(existing.getTimeStart())) &&
                        (timeEnd.isBefore(existing.getTimeEnd()) || timeEnd.isEqual(existing.getTimeEnd()))
                );
    }
}
