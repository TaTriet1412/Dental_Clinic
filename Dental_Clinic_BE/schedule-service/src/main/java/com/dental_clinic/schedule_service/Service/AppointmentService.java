package com.dental_clinic.schedule_service.Service;

import com.dental_clinic.common_lib.constant.CaseVariableUtils;
import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.schedule_service.Client.PatientClient;
import com.dental_clinic.schedule_service.DTO.Client.PatientRes;
import com.dental_clinic.schedule_service.DTO.Request.CreateAppointmentReq;
import com.dental_clinic.schedule_service.DTO.Request.EmailAppointmentPatientReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointStatusReq;
import com.dental_clinic.schedule_service.DTO.Request.UpdateAppointmentReq;
import com.dental_clinic.schedule_service.DTO.Response.PageResponse;
import com.dental_clinic.schedule_service.Entity.Appointment;
import com.dental_clinic.schedule_service.Entity.AppointmentStatus;
import com.dental_clinic.schedule_service.Repository.AppointmentRepository;
import com.dental_clinic.schedule_service.Utils.StringUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.mail.MessagingException;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Field;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final MongoTemplate mongoTemplate;
    AppointmentRepository appointmentRepository;
    WorkScheduleService workScheduleService;
    EmailService emailService;
    PatientClient patientClient;
    ObjectMapper objectMapper;

    @Autowired
    @Lazy
    public AppointmentService(
            PatientClient patientClient,
            AppointmentRepository appointmentRepository,
            WorkScheduleService workScheduleService,
            EmailService emailService,
            ObjectMapper objectMapper, MongoTemplate mongoTemplate) {
        this.objectMapper = objectMapper;
        this.patientClient = patientClient;
        this.emailService = emailService;
        this.workScheduleService = workScheduleService;
        this.appointmentRepository = appointmentRepository;
        this.mongoTemplate = mongoTemplate;
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .sorted(Comparator.comparing(Appointment::getCreatedAt).reversed())
                .toList();
    }

    public Page<Appointment> getPaginationAppointments(
            String filtersJson,
            int page,
            int size,
            String sortFields) {
        try {
            int pageIndex = page > 0 ? page - 1 : 0;

            // Parse filters from JSON
            JsonNode filtersNode = filtersJson != null
                    ? objectMapper.readTree(filtersJson)
                    : objectMapper.createObjectNode();

            // Build Sort
            Sort sort = Sort.unsorted();
            if (sortFields != null && !sortFields.trim().isEmpty()) {
                try {
                    // Decode only once
                    String decodedSortFields = URLDecoder.decode(sortFields, StandardCharsets.UTF_8.name());
                    String[] sortParts = decodedSortFields.split(",");
                    String sortField = sortParts[0].trim();
                    Sort.Direction direction = sortParts.length > 1
                            && sortParts[1].trim().equalsIgnoreCase("asc")
                            ? Sort.Direction.ASC : Sort.Direction.DESC;
                    // Convert camelCase to snake_case for MongoDB
                    String mongoField = CaseVariableUtils.changeCamelCaseToSnakeCase(sortField);
                    sort = Sort.by(direction, mongoField);
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException("Error decoding sort fields", e);
                }
            }

            Pageable pageable = PageRequest.of(pageIndex, size, sort);

            // Build Criteria
            List<Criteria> criteriaList = new ArrayList<>();

            // Define fields that should be treated as arrays of strings (e.g., status)
            Set<String> arrayFields = new HashSet<>(Arrays.asList("status"));

            for (String arrayField : arrayFields) {
                if (filtersNode.has(arrayField) && !filtersNode.get(arrayField).isNull()) {
                    JsonNode arrayNode = filtersNode.get(arrayField);
                    if (arrayNode.isArray()) {
                        List<String> valueList = new ArrayList<>();
                        arrayNode.forEach(item -> {
                            if (item.isTextual() && !item.asText().isBlank()) {
                                valueList.add(item.asText());
                            }
                        });
                        if (!valueList.isEmpty()) {
                            String mongoField = CaseVariableUtils.changeCamelCaseToSnakeCase(arrayField);
                            criteriaList.add(Criteria.where(mongoField).in(valueList));
                        }
                    } else {
                        // Single value
                        if (arrayNode.isTextual() && !arrayNode.asText().isBlank()) {
                            String mongoField = CaseVariableUtils.changeCamelCaseToSnakeCase(arrayField);
                            criteriaList.add(Criteria.where(mongoField).is(arrayNode.asText()));
                        }
                    }
                }
            }



            // Handle date fields
            String[] dateFields = {"timeStart", "timeEnd", "createdAt"};
            for (String dateField : dateFields) {
                if (filtersNode.has(dateField) && !filtersNode.get(dateField).asText().isEmpty()) {
                    try {
                        String dateStr = filtersNode.get(dateField).asText();
                        LocalDate localDate = LocalDate.parse(dateStr.substring(0, 10));
                        LocalDateTime startOfDay = localDate.atStartOfDay();
                        LocalDateTime endOfDay = localDate.atTime(LocalTime.MAX);
                        String mongoField = CaseVariableUtils.changeCamelCaseToSnakeCase(dateField);
                        criteriaList.add(Criteria.where(mongoField).gte(startOfDay).lte(endOfDay));
                    } catch (DateTimeParseException e) {
                        throw new RuntimeException("Invalid date format for " + dateField, e);
                    }
                }
            }

            // Handle dynamic fields with partial matching (case-insensitive)
            Set<String> specialFields = new HashSet<>(Arrays.asList("status", "timeStart", "timeEnd", "createdAt"));
            Iterator<Map.Entry<String, JsonNode>> fields = filtersNode.fields();
            while (fields.hasNext()) {
                Map.Entry<String, JsonNode> entry = fields.next();
                String field = entry.getKey();
                JsonNode valueNode = entry.getValue();
                Set<String> numericFields = Set.of("denId", "assiId"); // thêm các trường số khác nếu có

                if (!specialFields.contains(field) && !valueNode.asText().isEmpty()) {
                    String mongoField = CaseVariableUtils.changeCamelCaseToSnakeCase(field);
                    String value = valueNode.asText();

                    // Handle id field
                    if ("id".equals(field) && !valueNode.asText().isEmpty()) {
                        try {
                            ObjectId objectId = new ObjectId(valueNode.asText());
                            criteriaList.add(Criteria.where("_id").is(objectId));
                        } catch (IllegalArgumentException e) {
                            // Không phải ObjectId hợp lệ, bỏ qua filter này
                        }
                        continue;
                    }

                    if (numericFields.contains(field)) {
                        try {
                            criteriaList.add(Criteria.where(mongoField).is(Long.parseLong(value)));
                        } catch (NumberFormatException ignored) {
                        }
                    } else {
                        String escaped = Pattern.quote(value);
                        String regex = ".*" + escaped + ".*";
                        criteriaList.add(Criteria.where(mongoField).regex(regex, "i"));
                    }
                }
            }

            // Build final query
            Query query = new Query();
            if (!criteriaList.isEmpty()) {
                query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));
            }
            query.with(pageable);

            // Execute query
            List<Appointment> appointments = mongoTemplate.find(query, Appointment.class);
            long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Appointment.class);

            return new PageImpl<>(appointments, pageable, total);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing filters JSON", e);
        }
    }

    public List<String> getAppointmentStatusList() {
        return Arrays.stream(AppointmentStatus.values())
                .map(AppointmentStatus::toString)
                .collect(Collectors.toList());
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
                .filter(appointment
                        -> appointment.getStatus() == AppointmentStatus.confirmed
                && appointment.getDenId().equals(denId))
                .toList();
        return appointments.stream().noneMatch(existing
                -> existing.getDenId().equals(denId)
                && !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart()))
                && !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForPat(String patId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment
                        -> appointment.getStatus() == AppointmentStatus.confirmed
                && appointment.getPatId().equals(patId))
                .toList();
        return appointments.stream().noneMatch(existing
                -> existing.getPatId().equals(patId)
                && !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart()))
                && !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForAssi(Long assiId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment
                        -> appointment.getStatus() == AppointmentStatus.confirmed
                && appointment.getAssiId().equals(assiId))
                .toList();;
        return appointments.stream().noneMatch(existing
                -> existing.getAssiId().equals(assiId)
                && !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart()))
                && !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForDenNotId(String appointmentId, Long denId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment
                        -> appointment.getStatus() == AppointmentStatus.confirmed
                && appointment.getDenId().equals(denId) && !Objects.equals(appointment.getId(), appointmentId))
                .toList();
        return appointments.stream().noneMatch(existing
                -> existing.getDenId().equals(denId)
                && !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart()))
                && !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForPatNotId(String appointmentId, String patId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment
                        -> appointment.getStatus() == AppointmentStatus.confirmed
                && appointment.getPatId().equals(patId) && !Objects.equals(appointment.getId(), appointmentId))
                .toList();
        return appointments.stream().noneMatch(existing
                -> existing.getPatId().equals(patId)
                && !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart()))
                && !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    private boolean isAppointmentTimeValidForAssiNotId(String appointmentId, Long assiId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        List<Appointment> appointments = appointmentRepository.findAll().stream()
                .filter(appointment
                        -> appointment.getStatus() == AppointmentStatus.confirmed
                && appointment.getAssiId().equals(assiId) && !Objects.equals(appointment.getId(), appointmentId))
                .toList();;
        return appointments.stream().noneMatch(existing
                -> existing.getAssiId().equals(assiId)
                && !(timeEnd.isEqual(existing.getTimeStart()) || timeEnd.isBefore(existing.getTimeStart()))
                && !(timeStart.isEqual(existing.getTimeEnd()) || timeStart.isAfter(existing.getTimeEnd()))
        );
    }

    public Map<String, LocalDateTime> getAppointmentTimeRange(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Appointment> filteredAppointments = getFilteredAppointmentsInReqRange(userId, startTime, endTime);

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

    public List<Appointment> getFilteredAppointmentsInReqRange(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        return appointmentRepository.findAll().stream()
                .filter(appointment
                        -> (appointment.getDenId().equals(userId) || appointment.getAssiId().equals(userId))
                && (appointment.getTimeStart().isAfter(startTime) || appointment.getTimeStart().isEqual(startTime))
                && (appointment.getTimeEnd().isBefore(endTime) || appointment.getTimeEnd().isEqual(endTime))
                && appointment.getStatus() != AppointmentStatus.cancelled
                && appointment.getStatus() != AppointmentStatus.not_show)
                .toList();
    }

    public Appointment createAppointment(CreateAppointmentReq req) throws MessagingException, JsonProcessingException {
        try {
            ApiResponse<Object> patientApiResponse = patientClient.getPatientById(req.patId());
            Object result = patientApiResponse.getResult();
            PatientRes patientRes = objectMapper.convertValue(result, PatientRes.class);

            checkValidAppointmentForSchedule(req.assiId(), req.denId(), req.timeStart(), req.timeEnd());
            checkValidAppointmentWithExistedData(req.denId(), req.assiId(), req.patId(), req.timeStart(), req.timeEnd());

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

            EmailAppointmentPatientReq emailAppointmentPatientReq
                    = getEmailAppointmentPatientReq(savedAppointment, patientRes.getEmail(), patientRes.getName());
            emailService.sendAppointmentConfirmForPatient(emailAppointmentPatientReq);

            return savedAppointment;
        } catch (AppException e) {
            throw (e);
        } catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }

    }

    private void checkValidAppointmentWithExistedData(
            Long denId,
            Long assiId,
            String patId,
            LocalDateTime timeStart,
            LocalDateTime timeEnd) {
        if (!isAppointmentTimeValidForDen(denId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của nha sĩ");
        }

        if (!isAppointmentTimeValidForPat(patId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của bệnh nhân");
        }

        if (!isAppointmentTimeValidForAssi(assiId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của phụ tá");
        }
    }

    private void checkValidAppointmentWithExistedDataNotID(
            String appointmentId,
            Long denId,
            Long assiId,
            String patId,
            LocalDateTime timeStart,
            LocalDateTime timeEnd) {
        if (!isAppointmentTimeValidForDenNotId(appointmentId, denId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của nha sĩ");
        }

        if (!isAppointmentTimeValidForPatNotId(appointmentId, patId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của bệnh nhân");
        }

        if (!isAppointmentTimeValidForAssiNotId(appointmentId, assiId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của phụ tá");
        }
    }

    private void checkValidAppointmentForSchedule(Long assiId, Long denId, LocalDateTime timeStart, LocalDateTime timeEnd) {
        if (!workScheduleService.isTimeRangeInWorkSchedule(assiId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian không nằm trong lịch làm việc của phụ tá");
        }

        if (!workScheduleService.isTimeRangeInWorkSchedule(denId, timeStart, timeEnd)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian không nằm trong lịch làm việc của nha sĩ");
        }
    }

    public Appointment updateAppointment(UpdateAppointmentReq req) throws JsonProcessingException {
        Appointment appointment = getAppointmentById(req.id());

        if (isEndStatus(appointment.getStatus().toString())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể chỉnh sửa lịch hẹn vì nó ở trạng thái cuối");
        }

        req.denId().ifPresent(appointment::setDenId);
        req.assiId().ifPresent(appointment::setAssiId);

        boolean isPatChanged = req.patId() != null && !Objects.equals(appointment.getPatId(), req.patId());

        if (isPatChanged && appointment.getStatus() != AppointmentStatus.confirmed) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể thay đổi bệnh nhân khi lịch hẹn không phải trạng thái xác nhận");
        }

        LocalDateTime now = LocalDateTime.now();

        req.timeStart().ifPresent(timeStart -> {
            if (timeStart.isBefore(now)) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải là thời gian hiện tại hoặc trong tương lai");
            }
            appointment.setTimeStart(timeStart);
        });
        req.timeEnd().ifPresent(timeEnd -> {
            if (timeEnd.isBefore(now)) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian kết thúc phải là thời gian hiện tại hoặc trong tương lai");
            }
            appointment.setTimeEnd(timeEnd);
        });

        req.symptom().ifPresent(symptom -> {
            if (symptom.isBlank()) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Triệu chứng không được để trống");
            }

            appointment.setSymptom(symptom);
        });

        req.note().ifPresent(appointment::setNote);

        if (appointment.getTimeStart().isEqual(appointment.getTimeEnd()) || appointment.getTimeStart().isAfter(appointment.getTimeEnd())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bắt đầu phải trước thời gian kết thúc");
        }

        checkValidAppointmentForSchedule(appointment.getAssiId(), appointment.getDenId(), appointment.getTimeStart(), appointment.getTimeEnd());
        checkValidAppointmentWithExistedDataNotID(appointment.getId(), appointment.getDenId(), appointment.getAssiId(), appointment.getPatId(), appointment.getTimeStart(), appointment.getTimeEnd());

        if (isPatChanged) {
            if (!isAppointmentTimeValidForPat(req.patId(), appointment.getTimeStart(), appointment.getTimeEnd())) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Thời gian bị trùng lặp với lịch hẹn khác của bệnh nhân");
            }
            appointment.setPatId(req.patId());
        }
        Appointment savedAppointment = appointmentRepository.save(appointment);

        if (isPatChanged) {
            try {
                ApiResponse<Object> patientApiResponse = patientClient.getPatientById(req.patId());
                Object result = patientApiResponse.getResult();
                PatientRes patientRes = objectMapper.convertValue(result, PatientRes.class);
                EmailAppointmentPatientReq emailAppointmentPatientReq
                        = getEmailAppointmentPatientReq(savedAppointment, patientRes.getEmail(), patientRes.getName());
                emailService.sendAppointmentConfirmForPatient(emailAppointmentPatientReq);
            } catch (AppException e) {
                throw (e);
            } catch (WebClientResponseException ex) {
                String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
                int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

                // Nếu body trả về dạng JSON, bạn parse như này:
                ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

                throw new AppException(ErrorCode.INVALID_REQUEST,
                        errorResponse.getMessage());
            } catch (MessagingException e) {
                throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Mail có lỗi trong quá trình gửi");
            }
        }
        return savedAppointment;
    }

    public void changeStatusAppointment(UpdateAppointStatusReq req) {
        try {
            Appointment appointment = getAppointmentById(req.appointment_id());

            ApiResponse<Object> patientApiResponse = patientClient.getPatientById(appointment.getPatId());
            Object result = patientApiResponse.getResult();
            PatientRes patientRes = objectMapper.convertValue(result, PatientRes.class);

            if (req.status().equals(appointment.getStatus().toString())) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Trạng thái không được giống trạng thái hiện tại");
            }
            try {
                checkValidStatusBeforeChange(req, appointment);
                appointment.setStatus(AppointmentStatus.valueOf(req.status()));

                if (AppointmentStatus.valueOf(req.status()) == AppointmentStatus.finished
                        || AppointmentStatus.valueOf(req.status()) == AppointmentStatus.cancelled
                        || AppointmentStatus.valueOf(req.status()) == AppointmentStatus.not_show) {
                    EmailAppointmentPatientReq emailAppointmentPatientReq
                            = getEmailAppointmentPatientReq(appointment, patientRes.getEmail(), patientRes.getName());
                    emailService.sendAppointmentWithNewStatusForPatient(emailAppointmentPatientReq);
                }

            } catch (IllegalArgumentException e) {
                throw new AppException(ErrorCode.INVALID_REQUEST, "Trạng thái không hợp lệ: " + req.status());
            } catch (MessagingException e) {
                throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Mail có lỗi trong quá trình gửi");
            }
            appointmentRepository.save(appointment);
        } catch (AppException e) {
            throw e;
        } catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = null;
            try {
                errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);
            } catch (JsonProcessingException ex1) {
                throw new AppException(ErrorCode.INTERNAL_SERVER_ERROR, "Lỗi không xác định");
            }

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }

    }

    public static EmailAppointmentPatientReq getEmailAppointmentPatientReq(
            Appointment appointment,
            String emailPatient,
            String patientName
    ) {
        return EmailAppointmentPatientReq.builder()
                .email(emailPatient)
                .appointmentId(appointment.getId())
                .dentistName("Tên nha sĩ")
                .assistantName("Tên phụ tá")
                .patientName(patientName)
                .patientId(appointment.getPatId())
                .timeStart(appointment.getTimeStart())
                .timeEnd(appointment.getTimeEnd())
                .symptoms(appointment.getSymptom())
                .note(appointment.getNote())
                .status(appointment.getStatus())
                .build();
    }

    public void checkValidStatusBeforeChange(UpdateAppointStatusReq req, Appointment appointment) {
        if (AppointmentStatus.valueOf(req.status()) == AppointmentStatus.confirmed) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể chỉnh sửa lại trạng thái xác nhận");
        }

        if (isEndStatus(appointment.getStatus().toString())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể chỉnh sửa trạng thái");
        }

        if (AppointmentStatus.valueOf(req.status()) == AppointmentStatus.cancelled
                || AppointmentStatus.valueOf(req.status()) == AppointmentStatus.not_show) {
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

    public boolean isEndStatus(String status) {
        AppointmentStatus appointmentStatus = AppointmentStatus.valueOf(status);
        return (appointmentStatus == AppointmentStatus.finished
                || appointmentStatus == AppointmentStatus.cancelled
                || appointmentStatus == AppointmentStatus.not_show);
    }

    public Appointment getAppointmentById(String id) {
        return appointmentRepository.findById(id).orElseThrow(()
                -> new AppException(ErrorCode.NOT_FOUND, "Không tìm thấy lịch hẹn có id = '" + id + "'"));
    }

    public List<Appointment> getAppointmentsByDenId(Long denId) {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getDenId().equals(denId))
                .sorted(Comparator.comparing(Appointment::getCreatedAt).reversed())
                .toList();
    }
}
