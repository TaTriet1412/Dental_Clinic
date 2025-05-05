package com.dental_clinic.schedule_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.schedule_service.DTO.Request.CreateAppointmentReq;
import com.dental_clinic.schedule_service.DTO.Request.EmailAppointmentPatientReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointStatusReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointmentReq;
import com.dental_clinic.schedule_service.DTO.Response.PageResponse;
import com.dental_clinic.schedule_service.Entity.Appointment;
import com.dental_clinic.schedule_service.Entity.AppointmentStatus;
import com.dental_clinic.schedule_service.Repository.AppointmentRepository;
import com.dental_clinic.schedule_service.Utils.StringUtils;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AppointmentService {
    AppointmentRepository appointmentRepository;
    WorkScheduleService workScheduleService;
    EmailService emailService;

    @Autowired
    @Lazy
    public AppointmentService(
            AppointmentRepository appointmentRepository,
            WorkScheduleService workScheduleService,
            EmailService emailService) {
        this.emailService = emailService;
        this.workScheduleService = workScheduleService;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .sorted(Comparator.comparing(Appointment::getCreatedAt).reversed())
                .toList();
    }

    public PageResponse<Appointment> getFilteredAndSortedAppointments(Map<String, Object> filters, int page, int size, Map<String, Boolean> sortFields) {
        // Step 1: Lấy toàn bộ dữ liệu
        List<Appointment> allAppointments = appointmentRepository.findAll();

        // Step 2: Lọc
        List<Appointment> filteredAppointments = allAppointments.stream()
                .filter(appointment -> filters.entrySet().stream()
                        .allMatch(entry -> {
                            try {
                                Field declaredField = Appointment.class.getDeclaredField(entry.getKey());
                                declaredField.setAccessible(true);
                                Object fieldValue = declaredField.get(appointment);

                                if (fieldValue == null) return false;

                                // Convert filter value (String) to the field type
                                Class<?> fieldType = declaredField.getType();
                                String rawValue = entry.getValue().toString();

                                Object convertedValue = StringUtils.convertStringToType(rawValue, fieldType);

                                return fieldValue.equals(convertedValue);
                            } catch (NoSuchFieldException | IllegalAccessException e) {
                                return false;
                            }
                        }))
                .collect(Collectors.toList());

        // Step 3: Sort
        Comparator<Appointment> comparator = null;
        for (Map.Entry<String, Boolean> entry : sortFields.entrySet()) {
            Comparator<Appointment> fieldComparator = getAppointmentComparator(entry);
            comparator = (comparator == null) ? fieldComparator : comparator.thenComparing(fieldComparator);
        }

        if (comparator != null) {
            filteredAppointments = filteredAppointments.stream()
                    .sorted(comparator)
                    .collect(Collectors.toList());
        }

        // Step 4: Phân trang thủ công
//        int start = Math.min(page * size, filteredAppointments.size());
//        int end = Math.min(start + size, filteredAppointments.size());

//        return filteredAppointments.subList(start, end);

        // Phân trang thủ công
        int startPage = page * size;
        int endPage = Math.min(startPage + size, filteredAppointments.size());

        List<Appointment> pagedAppointments = filteredAppointments.subList(startPage, endPage);

        // Tính tổng số trang và tổng số bản ghi
        long totalItems = filteredAppointments.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);

        // Trả về dữ liệu dưới dạng PageResponse
        return new PageResponse<>(pagedAppointments, totalItems, totalPages, page);
    }
    private static Comparator<Appointment> getAppointmentComparator(Map.Entry<String, Boolean> entry) {
        String field = (entry.getKey()); // Ánh xạ tên trường
        boolean ascending = entry.getValue();


        Comparator<Appointment> fieldComparator = Comparator.comparing(appointment -> {
            try {
                Field declaredField = Appointment.class.getDeclaredField(field);
                declaredField.setAccessible(true); // <-- Quan trọng
                return (Comparable) declaredField.get(appointment);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                return null;
            }
        }, Comparator.nullsLast(Comparator.naturalOrder()));

        if (!ascending) {
            fieldComparator = fieldComparator.reversed();
        }
        return fieldComparator;
    }

    private boolean isAppointmentTimeValidForDen(Long denId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment ->
                        appointment.getStatus() == AppointmentStatus.confirmed &&
                                appointment.getDenId().equals(denId))
                .toList();
        return appointments.stream().noneMatch(existing ->
                existing.getDenId().equals(denId) &&
                        !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart())) &&
                        !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForPat(String patId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment ->
                        appointment.getStatus() == AppointmentStatus.confirmed &&
                            appointment.getPatId().equals(patId))
                .toList();
        return appointments.stream().noneMatch(existing ->
                existing.getPatId().equals(patId) &&
                        !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart())) &&
                        !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForAssi(Long assiId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment ->
                        appointment.getStatus() == AppointmentStatus.confirmed &&
                                appointment.getAssiId().equals(assiId))
                .toList();;
        return appointments.stream().noneMatch(existing ->
                existing.getAssiId().equals(assiId) &&
                        !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart())) &&
                        !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForDenNotId(String appointmentId, Long denId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment ->
                        appointment.getStatus() == AppointmentStatus.confirmed &&
                                appointment.getDenId().equals(denId) && !Objects.equals(appointment.getId() , appointmentId))
                .toList();
        return appointments.stream().noneMatch(existing ->
                existing.getDenId().equals(denId) &&
                        !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart())) &&
                        !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForPatNotId(String appointmentId,String patId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment ->
                        appointment.getStatus() == AppointmentStatus.confirmed &&
                                appointment.getPatId().equals(patId)&& !Objects.equals(appointment.getId() , appointmentId))
                .toList();
        return appointments.stream().noneMatch(existing ->
                existing.getPatId().equals(patId) &&
                        !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart())) &&
                        !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForAssiNotId(String appointmentId,Long assiId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment ->
                        appointment.getStatus() == AppointmentStatus.confirmed &&
                                appointment.getAssiId().equals(assiId)&& !Objects.equals(appointment.getId() , appointmentId))
                .toList();;
        return appointments.stream().noneMatch(existing ->
                existing.getAssiId().equals(assiId) &&
                        !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart())) &&
                        !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    public Map<String, LocalDateTime> getAppointmentTimeRange(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Appointment> filteredAppointments = getFilteredAppointmentsInReqRange(userId , startTime , endTime);

        if (filteredAppointments.isEmpty()) {
            return Map.of(); // Return an empty map if no appointments match
        }

        LocalDateTime earliestStartTime = filteredAppointments.stream()
                .map(Appointment::getTimeStart)
                .min(LocalDateTime::compareTo)
                .orElseThrow();

        LocalDateTime latestEndTime = filteredAppointments.stream()
                .map(Appointment::getTimeEnd)
                .max(LocalDateTime::compareTo)
                .orElseThrow();

        return Map.of(
                "earliestStartTime", earliestStartTime,
                "latestEndTime", latestEndTime
        );
    }

    public List<Appointment> getFilteredAppointmentsInReqRange(Long userId , LocalDateTime startTime , LocalDateTime endTime) {
        return appointmentRepository.findAll().stream()
                .filter(appointment ->
                        (appointment.getDenId().equals(userId) || appointment.getAssiId().equals(userId)) &&
                                (appointment.getTimeStart().isAfter(startTime) || appointment.getTimeStart().isEqual(startTime)) &&
                                (appointment.getTimeEnd().isBefore(endTime) || appointment.getTimeEnd().isEqual(endTime)) &&
                                appointment.getStatus() != AppointmentStatus.cancelled &&
                                appointment.getStatus() != AppointmentStatus.not_show)
                .toList();
    }



    public Appointment createAppointment(CreateAppointmentReq req) throws MessagingException {
        if(req.timeStart().isEqual(req.timeEnd()) || req.timeStart().isAfter(req.timeEnd()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải trước thời gian kết thúc");

        checkValidAppointmentForSchedule(req.assiId(), req.denId(), req.timeStart(), req.timeEnd());
        checkValidAppointmentWithExistedData(req.denId(), req.assiId() , req.patId() , req.timeStart(), req.timeEnd());

        Appointment appointment = Appointment.builder()
                .patId(req.patId())
                .denId(req.denId())
                .assiId(req.assiId())
                .timeStart(req.timeStart())
                .timeEnd(req.timeEnd())
                .symptom(req.symptom())
                .note(req.note())
                .createdAt(LocalDateTime.now())
                .status(AppointmentStatus.confirmed)
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        EmailAppointmentPatientReq emailAppointmentPatientReq = getEmailAppointmentPatientReq(savedAppointment);
        emailService.sendAppointmentConfirmForPatient(emailAppointmentPatientReq);
        
        return savedAppointment;
    }

    private void checkValidAppointmentWithExistedData(
            Long denId,
            Long assiId,
            String patId,
            LocalDateTime timeStart,
            LocalDateTime timeEnd) {
        if(!isAppointmentTimeValidForDen(denId, timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của nha sĩ");

        if(!isAppointmentTimeValidForPat(patId, timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của bệnh nhân");

        if(!isAppointmentTimeValidForAssi(assiId, timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của phụ tá");
    }

    private void checkValidAppointmentWithExistedDataNotID(
            String appointmentId,
            Long denId,
            Long assiId,
            String patId,
            LocalDateTime timeStart,
            LocalDateTime timeEnd) {
        if(!isAppointmentTimeValidForDenNotId(appointmentId,denId, timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của nha sĩ");

        if(!isAppointmentTimeValidForPatNotId(appointmentId,patId, timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của bệnh nhân");

        if(!isAppointmentTimeValidForAssiNotId(appointmentId,assiId, timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của phụ tá");
    }

    private void checkValidAppointmentForSchedule(Long assiId, Long denId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        if(!workScheduleService.isTimeRangeInWorkSchedule(assiId , timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian không nằm trong lịch làm việc của phụ tá");

        if(!workScheduleService.isTimeRangeInWorkSchedule(denId , timeStart, timeEnd))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian không nằm trong lịch làm việc của nha sĩ");
    }

    public Appointment updateAppointment(UpdateAppointmentReq req){
        Appointment appointment = getAppointmentById(req.id());

        if (isEndStatus(appointment.getStatus().toString()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể chỉnh sửa lịch hẹn vì nó ở trạng thái cuối");

        req.denId().ifPresent(denId -> appointment.setDenId(denId));
        req.assiId().ifPresent(assiId -> appointment.setAssiId(assiId));
        req.patId().ifPresent(patId -> appointment.setPatId(patId));
        req.timeStart().ifPresent(timeStart -> {
            if (timeStart.isBefore(LocalDateTime.now()))
                throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải là thời gian hiện tại hoặc trong tương lai");
            appointment.setTimeStart(timeStart);
        });
        req.timeEnd().ifPresent(timeEnd -> {
            if (timeEnd.isBefore(LocalDateTime.now()))
                throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian kết thúc phải là thời gian hiện tại hoặc trong tương lai");
            appointment.setTimeEnd(timeEnd);
        });
        req.symptom().ifPresent(symptom -> {
            if (symptom.isBlank())
                throw new AppException(ErrorCode.INVALID_REQUEST, "Triệu chứng không được để trống");

            appointment.setSymptom(symptom);
        });
        req.note().ifPresent(note -> {
            appointment.setNote(note);
        });

        if (appointment.getTimeStart().isEqual(appointment.getTimeEnd()) || appointment.getTimeStart().isAfter(appointment.getTimeEnd()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải trước thời gian kết thúc");

        checkValidAppointmentForSchedule(appointment.getAssiId(), appointment.getDenId(), appointment.getTimeStart(), appointment.getTimeEnd());
        checkValidAppointmentWithExistedDataNotID(appointment.getId(),appointment.getDenId(),appointment.getAssiId(),appointment.getPatId(),appointment.getTimeStart(),appointment.getTimeEnd());

        return appointmentRepository.save(appointment);
    }

    public void changeStatusAppointment(UpdateAppointStatusReq req){
        Appointment appointment = getAppointmentById(req.appointment_id());

        if(req.status().equals(appointment.getStatus().toString()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Trạng thái không được giống trạng thái hiện tại");
        try {
            checkValidStatusBeforeChange(req , appointment);
            appointment.setStatus(AppointmentStatus.valueOf(req.status()));


            if (AppointmentStatus.valueOf(req.status())==AppointmentStatus.finished
                || AppointmentStatus.valueOf(req.status())==AppointmentStatus.cancelled
                || AppointmentStatus.valueOf(req.status())==AppointmentStatus.not_show
            ) {
                EmailAppointmentPatientReq emailAppointmentPatientReq = getEmailAppointmentPatientReq(appointment);
                emailService.sendAppointmentWithNewStatusForPatient(emailAppointmentPatientReq);
            }

        } catch (IllegalArgumentException e) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Trạng thái không hợp lệ: " + req.status());
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Mail có lỗi trong quá trình gửi");
        }
        appointmentRepository.save(appointment);
    }

    public static EmailAppointmentPatientReq getEmailAppointmentPatientReq(Appointment appointment) {
        return EmailAppointmentPatientReq.builder()
                .email("tatriet_tony@1zulieu.com")
                .appointmentId(appointment.getId())
                .dentistName("Tên nha sĩ")
                .assistantName("Tên phụ tá")
                .patientName("Tên bệnh nhân")
                .patientId(appointment.getPatId())
                .timeStart(appointment.getTimeStart())
                .timeEnd(appointment.getTimeEnd())
                .symptoms(appointment.getSymptom())
                .note(appointment.getNote())
                .status(appointment.getStatus())
                .build();
    }

    public void checkValidStatusBeforeChange(UpdateAppointStatusReq req , Appointment appointment) {
        if(AppointmentStatus.valueOf(req.status())==AppointmentStatus.confirmed)
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể chỉnh sửa lại trạng thái xác nhận");

        if (isEndStatus(appointment.getStatus().toString()))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể chỉnh sửa trạng thái");

        if(AppointmentStatus.valueOf(req.status())==AppointmentStatus.cancelled
            || AppointmentStatus.valueOf(req.status())==AppointmentStatus.not_show
        ) {
            if (req.note().isEmpty() || req.note().get().isBlank() || req.note().get() == null) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Trạng thái mới phải có lý do");
            }

            req.note().ifPresent(note -> {
                String existingNote = appointment.getNote() == null ? "" : appointment.getNote().trim();
                String formattedNote = String.format("- Lí do: %s ", note.trim());
                appointment.setNote(existingNote + formattedNote);
            });
        }
    }

    public boolean isEndStatus(String status){
        AppointmentStatus appointmentStatus  = AppointmentStatus.valueOf(status);
        return (appointmentStatus == AppointmentStatus.finished ||
                appointmentStatus == AppointmentStatus.cancelled ||
                appointmentStatus == AppointmentStatus.not_show);
    }

    public Appointment getAppointmentById(String id) {
        return appointmentRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy lịch hẹn có id = '" + id + "'"));
    }

    public List<Appointment> getAppointmentsByDenId(Long denId) {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getDenId().equals(denId))
                .sorted(Comparator.comparing(Appointment::getCreatedAt).reversed())
                .toList();
    }
}

