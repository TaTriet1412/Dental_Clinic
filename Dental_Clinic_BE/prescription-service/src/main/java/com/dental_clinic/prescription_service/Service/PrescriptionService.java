package com.dental_clinic.prescription_service.Service;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.prescription_service.Client.MaterialClient;
import com.dental_clinic.prescription_service.DTO.Client.UpdateQuantityMaterialReq;
import com.dental_clinic.prescription_service.DTO.Request.CreatePrescriptionReq;
import com.dental_clinic.prescription_service.DTO.Request.MedicineReq;
import com.dental_clinic.prescription_service.DTO.Request.UpdatePrescriptionReq;
import com.dental_clinic.prescription_service.DTO.Response.PricePrescriptionRes;
import com.dental_clinic.prescription_service.Entity.Medicine;
import com.dental_clinic.prescription_service.Entity.Prescription;
import com.dental_clinic.prescription_service.Repository.PrescriptionRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.math.BigInteger;

@Service
public class PrescriptionService {
    PrescriptionRepository prescriptionRepository;
    MaterialClient materialClient;
    ObjectMapper objectMapper;

    @Autowired
    public PrescriptionService(
            MaterialClient materialClient,
            PrescriptionRepository prescriptionRepository,
            ObjectMapper objectMapper
    ) {
        this.prescriptionRepository = prescriptionRepository;
        this.materialClient = materialClient;
        this.objectMapper = objectMapper;

    }

    private Prescription findPrescriptionById(String id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy toa thuốc có id = " + id));
    }

    public PricePrescriptionRes getPrescriptionPrice(String id) {
        return PricePrescriptionRes.builder()
                .price(findPrescriptionById(id).getTotal_price())
                .build();
    }

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public List<Prescription> getPrescriptionsByPatientId(Long patId) {
        return prescriptionRepository.findByPatIdAndIsDeletedFalse(patId);
    }

    public List<Prescription> getPrescriptionsByDentistId(Long denId) {
        return prescriptionRepository.findByDenIdAndIsDeletedFalse(denId);
    }

    public Prescription getPrescriptionHasBillNullById(String id) {
        Prescription prescription = findPrescriptionById(id);
        Boolean exists = prescriptionRepository.existsByIdAndBillIdIsNullOrNotPresent(id);
        if (exists == null || !exists) {
            throw new AppException(ErrorCode.NOT_FOUND, "Toa thuốc này đã có hóa đơn riêng hoặc không tồn tại");
        }
        return prescription;
    }


    @Transactional
    public Prescription createPrescription(CreatePrescriptionReq request) throws JsonProcessingException {
        try {
            BigInteger totalPrice = request.medicines().stream()
                    .map(medicineReq -> BigInteger.valueOf(medicineReq.price())
                            .multiply(BigInteger.valueOf(medicineReq.quantity_medicine())))
                    .reduce(BigInteger.ZERO, BigInteger::add);

            List<UpdateQuantityMaterialReq> updateQuantityMaterialReqs = request.medicines().stream()
                    .map(medicineReq -> new UpdateQuantityMaterialReq(medicineReq.med_id(), (- medicineReq.quantity_medicine())))
                    .toList();

            materialClient.updateQuantityOfListMaterial(updateQuantityMaterialReqs);

            Prescription prescription = Prescription.builder()
                    .pat_id(request.pat_id())
                    .den_id(request.den_id())
                    .bill_id(null)
                    .note(request.note())
                    .medicines(request.medicines().stream()
                            .map(medicineReq
                                    -> new Medicine(medicineReq.med_id(), medicineReq.quantity_medicine()))
                            .collect(Collectors.toList()))
                    .total_price(totalPrice)
                    .is_deleted(false)
                    .created_at(LocalDateTime.now())
                    .build();

            return prescriptionRepository.save(prescription);

        } catch (AppException e) {
            throw e;
        } catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }
    }

    @Transactional
    public Prescription deleteVariablePrescription(String id) throws JsonProcessingException {
      try {
        Prescription prescription = findPrescriptionById(id);
        List<UpdateQuantityMaterialReq> updateQuantityMaterialReqs = prescription.getMedicines().stream()
            .map(medicine -> new UpdateQuantityMaterialReq(medicine.getMed_id(), medicine.getQuantity_medicine()))
            .toList();

        materialClient.updateQuantityOfListMaterial(updateQuantityMaterialReqs);

        checkWhetherPreDeleted(prescription);
          if (prescription.getBill_id() != null) {
              throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể xóa toa thuốc đã có hóa đơn");
          }
        prescription.setIs_deleted(true);
        return prescriptionRepository.save(prescription);
        } catch (AppException e) {
            throw e;
        } catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }
    }

    public void deletePrescriptionById(String id) {
        prescriptionRepository.deleteById(id);
    }

    private static void checkWhetherPreDeleted(Prescription prescription) {
        if (prescription.getIs_deleted()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Toa thuốc đã bị xóa");
        }

    }

    public Prescription updateBillIdForPrescription(String id, Long billId) {
        Prescription prescription = findPrescriptionById(id);
        checkWhetherPreDeleted(prescription);
        if (prescription.getBill_id() != null) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Toa thuốc đã có hóa đơn");
        }
        prescription.setBill_id(billId);
        return prescriptionRepository.save(prescription);
    }

    public Prescription removeBillIdForPrescription(String id) {
        Prescription prescription = findPrescriptionById(id);
        checkWhetherPreDeleted(prescription);
        prescription.setBill_id(null);
        return prescriptionRepository.save(prescription);
    }

    @Transactional
    public Prescription updatePrescription(UpdatePrescriptionReq request) {
        Prescription prescription = findPrescriptionById(request.id());
        checkBeforeUpdatePrescription(prescription);

        List<Medicine> oldMedicines = prescription.getMedicines();

        request.note().ifPresent(note -> {
            if (note.isBlank()) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Ghi chú không được để trống");
            }
            if (note.length() > 1000) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Ghi chú không được vượt quá 1000 ký tự");
            }
            prescription.setNote(note);
        });


        request.den_id().ifPresent(denId -> {
            if (denId < 1) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Mã nha sĩ phải lớn hơn 0");
            }
            prescription.setDen_id(denId);
        });

        request.pat_id().ifPresent(patId -> {
            if (patId.isBlank()) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Mã bệnh nhân không được để trống");
            }
            prescription.setPat_id(patId);
        });

        request.medicines().ifPresent(medicineReqs -> {
            if (medicineReqs.isEmpty()) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Danh sách thuốc không được để trống");
            }

            // Tính toán sự thay đổi số lượng vật liệu
            List<UpdateQuantityMaterialReq> updateQuantityMaterialReqs = medicineReqs.stream()
                    .collect(Collectors.toMap(MedicineReq::med_id, MedicineReq::quantity_medicine))
                    .entrySet()
                    .stream()
                    .map(entry -> {
                        Long medId = entry.getKey();
                        int newQuantity = entry.getValue();
                        int oldQuantity = oldMedicines.stream()
                                .filter(medicine -> medicine.getMed_id().equals(medId))
                                .mapToInt(Medicine::getQuantity_medicine)
                                .findFirst()
                                .orElse(0);
                        return new UpdateQuantityMaterialReq(medId, oldQuantity - newQuantity);
                    })
                    .toList();

            // Gửi yêu cầu cập nhật số lượng vật liệu
            materialClient.updateQuantityOfListMaterial(updateQuantityMaterialReqs);

            // Cập nhật danh sách thuốc và tổng giá
            BigInteger totalPrice = medicineReqs.stream()
                    .map(medicineReq -> BigInteger.valueOf(medicineReq.price())
                            .multiply(BigInteger.valueOf(medicineReq.quantity_medicine())))
                    .reduce(BigInteger.ZERO, BigInteger::add);


            List<Medicine> medicines = medicineReqs.stream()
                    .map(medicineReq -> new Medicine(medicineReq.med_id(), medicineReq.quantity_medicine()))
                    .collect(Collectors.toList());
            prescription.setMedicines(medicines);
            prescription.setTotal_price(totalPrice);
        });

        prescriptionRepository.save(prescription);

        return prescription;
    }

    private static void checkBeforeUpdatePrescription(Prescription prescription) {
        if (prescription.getIs_deleted()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể cập nhật toa thuốc đã xóa");
        }
        if (prescription.getBill_id() != null) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể cập nhật toa thuốc đã có hóa đơn");
        }
    }

    public Prescription getPrescriptionById(String id) {
        return findPrescriptionById(id);
    }
}
