package com.dental_clinic.prescription_service.Service;

import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.prescription_service.DTO.Request.CreatePrescriptionReq;
import com.dental_clinic.prescription_service.DTO.Request.UpdatePrescriptionReq;
import com.dental_clinic.prescription_service.DTO.Response.PricePrescriptionRes;
import com.dental_clinic.prescription_service.Entity.Medicine;
import com.dental_clinic.prescription_service.Entity.Prescription;
import com.dental_clinic.prescription_service.Repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.math.BigInteger;

@Service
public class PrescriptionService {
    private final PrescriptionRepository prescriptionRepository;

    @Autowired
    public PrescriptionService(PrescriptionRepository prescriptionRepository) {
        this.prescriptionRepository = prescriptionRepository;
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

    public Prescription createPrescription(CreatePrescriptionReq request) {
        Prescription prescription = createPrescriptionFromRequest(request);
        return prescriptionRepository.save(prescription);
    }

    public Prescription getPrescriptionHasBillNullById(String id) {
        Prescription prescription = findPrescriptionById(id);
        Boolean exists = prescriptionRepository.existsByIdAndBillIdIsNullOrNotPresent(id);
        if (exists == null || !exists) {
            throw new AppException(ErrorCode.NOT_FOUND, "Toa thuốc này đã có hóa đơn riêng hoặc không tồn tại");
        }
        return prescription;
    }


    private static Prescription createPrescriptionFromRequest(CreatePrescriptionReq request) {
        return Prescription.builder()
                .pat_id(request.pat_id())
                .den_id(request.den_id())
                .bill_id(null)
                .note(request.note())
                .medicines(request.medicines().stream()
                        .map(medicineReq
                                -> new Medicine(medicineReq.med_id(), medicineReq.quantity_medicine()))
                        .collect(Collectors.toList()))
                // TODO: Cập nhật giá khi có bill service
                .total_price(BigInteger.valueOf(0))
                .is_deleted(false)
                .created_at(LocalDateTime.now())
                .build();
    }

    public Prescription deletePrescription(String id) {
        Prescription prescription = findPrescriptionById(id);
        checkWhetherPreDeleted(prescription);
        prescription.setIs_deleted(true);
        return prescriptionRepository.save(prescription);
    }

    private static void checkWhetherPreDeleted(Prescription prescription) {
        if (prescription.getIs_deleted()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Toa thuốc đã bị xóa");
        }
    }

    public Prescription updateBillIdForPrescription(String id, Long billId) {
        Prescription prescription = findPrescriptionById(id);
        checkWhetherPreDeleted(prescription);
        prescription.setBill_id(billId);
        return prescriptionRepository.save(prescription);
    }

    public Prescription removeBillIdForPrescription(String id) {
        Prescription prescription = findPrescriptionById(id);
        checkWhetherPreDeleted(prescription);
        prescription.setBill_id(null);
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(UpdatePrescriptionReq request) {
        Prescription prescription = findPrescriptionById(request.id());
        checkBeforeUpdatePrescription(prescription);

        request.note().ifPresent(note -> {
            if (note.isBlank()) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Ghi chú không được để trống");
            }
            if (note.length() > 1000) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Ghi chú không được vượt quá 1000 ký tự");
            }
            prescription.setNote(note);
        });

//        TODO: Cập nhật khi có bill service
        prescription.setTotal_price(BigInteger.valueOf(0));

        request.den_id().ifPresent(denId -> {
            if (denId < 1) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Mã nha sĩ phải lớn hơn 0");
            }
            prescription.setDen_id(denId);
        });

        request.pat_id().ifPresent(patId -> {
            if (patId < 1) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Mã bệnh nhân phải lớn hơn 0");
            }
            prescription.setPat_id(patId);
        });

        request.medicines().ifPresent(medicineReqs -> {
            if (medicineReqs.isEmpty()) {
                throw new AppException(ErrorCode.FAIL_FORMAT_DATA, "Danh sách thuốc không được để trống");
            }
            List<Medicine> medicines = medicineReqs.stream()
                    .map(medicineReq -> new Medicine(medicineReq.med_id(), medicineReq.quantity_medicine()))
                    .collect(Collectors.toList());
            prescription.setMedicines(medicines);
        });

        return prescriptionRepository.save(prescription);
    }

    private static void checkBeforeUpdatePrescription(Prescription prescription) {
        if (prescription.getIs_deleted()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể cập nhật toa thuốc đã xóa");
        }
        if (prescription.getBill_id() != null) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể cập nhật toa thuốc đã có hóa đơn");
        }
    }
}
