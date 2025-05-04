package com.dental_clinic.payment_service.Service;

import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.dental_clinic.payment_service.Client.DentalClient;
import com.dental_clinic.payment_service.Client.PatientClient;
import com.dental_clinic.payment_service.Client.PrescriptionClient;
import com.dental_clinic.payment_service.DTO.Client.PriceCostDentalRes;
import com.dental_clinic.payment_service.DTO.Client.PricePrescriptionRes;
import com.dental_clinic.payment_service.DTO.Client.UpdateBillIdForPrescriptionReq;
import com.dental_clinic.payment_service.DTO.Request.CreateBillReq;
import com.dental_clinic.payment_service.DTO.Request.ServicesReq;
import com.dental_clinic.payment_service.DTO.Request.UpdateBillReq;
import com.dental_clinic.payment_service.Entity.Bill;
import com.dental_clinic.payment_service.Entity.BillDental;
import com.dental_clinic.payment_service.Entity.BillStatus;
import com.dental_clinic.payment_service.Repository.BillRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class BillService {
    BillRepository billRepository;
    DentalClient dentalClient;
    ObjectMapper objectMapper;
    PrescriptionClient prescriptionClient;
    PatientClient patientClient;

    @Autowired
    public BillService(
            BillRepository billRepository,
            DentalClient dentalClient,
            PrescriptionClient prescriptionClient,
            PatientClient patientClient,
            ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.patientClient = patientClient;
        this.prescriptionClient = prescriptionClient;
        this.dentalClient = dentalClient;
        this.billRepository = billRepository;
    }

    // Method to get all bills
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    // Method to get a bill by ID
    public Bill getBillById(Long id) {
        return billRepository.findById(id).orElseThrow(() ->
                new AppException(ErrorCode.NOT_FOUND,"Không tìm thấy hóa đơn có id: " + id));
    }

    // Method to create a new bill
    public Bill createBill(CreateBillReq req) throws JsonProcessingException {
        try {
            List<BillDental> billDentals = getBillDentals(req.services());

            // Kiểm tra toa thuốc
            prescriptionClient.getPrescriptionHasBillNullById(req.prescriptionId());

            // Lấy giá toa thuốc
            ApiResponse<Object> pricePrescriptionApiRes = prescriptionClient.getPrice(req.prescriptionId());
            Object result =  pricePrescriptionApiRes.getResult();
            PricePrescriptionRes pricePrescriptionRes = objectMapper.convertValue(result, PricePrescriptionRes.class);

            // Kiểm tra bệnh nhân tồn tại không
            ApiResponse<Object> checkPatientApi = patientClient.getPatientById(req.patientId());

            // Tạo hóa đơn
            // Tính tổng giá trị dịch vụ
            BigInteger dentalsTotalPrice = billDentals.stream()
                    .map(BillDental::getServicePrice)
                    .reduce(BigInteger.ZERO, BigInteger::add);

            // Tính tổng giá trị toa thuốc
            BigInteger prescriptionTotalPrice = pricePrescriptionRes.getPrice();

            // Tính tổng giá trị hóa đơn
            BigInteger totalPrice = dentalsTotalPrice.add((prescriptionTotalPrice));

            Bill bill = Bill.builder()
                    .patientId(req.patientId())
                    .prescriptionId(req.prescriptionId())
                    .totalPrice(totalPrice)
                    .prescriptionPrice(prescriptionTotalPrice)
                    .servicesTotalPrice(dentalsTotalPrice)
                    .status(BillStatus.CONFIRMED.getStatus())
                    .note(req.note() == null ? "" : req.note())
                    .createdAt(LocalDateTime.now())
                    .billServiceEntities(billDentals)
                    .build();

            // Gán Bill cho từng BillDental
            for (BillDental dental : billDentals) {
                dental.setBill(bill);
            }

            Bill savedBill = billRepository.save(bill);

            // Lưu mã hóa đơn cho prescription
            UpdateBillIdForPrescriptionReq updateBillIdForPrescriptionReq = UpdateBillIdForPrescriptionReq.builder()
                    .bill_id(savedBill.getId())
                    .build();
            prescriptionClient.updateBillIdForPrescription(req.prescriptionId(), updateBillIdForPrescriptionReq);
            return savedBill;

        } catch (AppException e) {
            throw e;
        }  catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }
    }

    public Bill updateBill(UpdateBillReq req) throws JsonProcessingException {
        boolean isNewPreId = false;
        try {
            Bill bill = getBillById(req.id());
            if(isEndStatusOfBill(BillStatus.valueOf(bill.getStatus().toUpperCase())))
                throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể cập nhật hóa đơn đã thanh toán hoặc đã hủy");

            List<BillDental> billDentals = getBillDentals(req.services());

            // Kiểm tra toa thuốc
            if(!Objects.equals(req.prescriptionId() , bill.getPrescriptionId())){
                isNewPreId = true;
            }

            if(isNewPreId) {
                prescriptionClient.removeBillIdForPrescription(bill.getPrescriptionId());
                prescriptionClient.getPrescriptionHasBillNullById(req.prescriptionId());

            }


            // Lấy giá toa thuốc
            ApiResponse<Object> pricePrescriptionApiRes = prescriptionClient.getPrice(req.prescriptionId());
            Object result =  pricePrescriptionApiRes.getResult();
            PricePrescriptionRes pricePrescriptionRes = objectMapper.convertValue(result, PricePrescriptionRes.class);

            // Tạo hóa đơn
            // Tính tổng giá trị dịch vụ
            BigInteger dentalsTotalPrice = billDentals.stream()
                    .map(BillDental::getServicePrice)
                    .reduce(BigInteger.ZERO, BigInteger::add);

            // Tính tổng giá trị toa thuốc
            BigInteger prescriptionTotalPrice = pricePrescriptionRes.getPrice();

            // Tính tổng giá trị hóa đơn
            BigInteger totalPrice = dentalsTotalPrice.add((prescriptionTotalPrice));

            bill.setPrescriptionId(req.prescriptionId());
            bill.setTotalPrice(totalPrice);
            bill.setPrescriptionPrice(prescriptionTotalPrice);
            bill.setServicesTotalPrice(dentalsTotalPrice);
            bill.setNote(req.note() == null ? "" : req.note());
            // Xóa danh sách cũ trước
            bill.getBillServiceEntities().clear();

            // Gán lại danh sách mới
            bill.getBillServiceEntities().addAll(billDentals);

            // Set lại bill cho các billDentals
            for (BillDental dental : billDentals) {
                dental.setBill(bill);
            }

            Bill savedBill = billRepository.save(bill);

            if(isNewPreId) {
                // Xóa mã hóa đơn cũ của prescription


                // Lưu mã hóa đơn cho prescription

                UpdateBillIdForPrescriptionReq updateBillIdForPrescriptionReq = UpdateBillIdForPrescriptionReq.builder()
                        .bill_id(savedBill.getId())
                        .build();
                prescriptionClient.updateBillIdForPrescription(req.prescriptionId(), updateBillIdForPrescriptionReq);

            }


            return savedBill;

        } catch (AppException e) {
            throw e;
        }  catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }
    }

    public boolean isEndStatusOfBill(BillStatus status) {
        return (status == BillStatus.CANCELLED || status == BillStatus.PAID);
    }

    public void cancelBill(Long id) throws JsonProcessingException {
        Bill bill = getBillById(id);
        try {
            if(isEndStatusOfBill(BillStatus.valueOf(bill.getStatus().toUpperCase())))
                throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể hủy hóa đơn đã thanh toán hoặc đã hủy");
            bill.setStatus(BillStatus.CANCELLED.getStatus());
            if(bill.getPrescriptionId() != null) {
                prescriptionClient.removeBillIdForPrescription(bill.getPrescriptionId());
            }

            billRepository.save(bill);

        } catch (AppException e) {
            throw  e;
        } catch (WebClientResponseException ex) {
            String errorBody = ex.getResponseBodyAsString(); // <-- lấy lỗi gốc
            int statusCode = ex.getRawStatusCode(); // ví dụ 400, 404, 500

            // Nếu body trả về dạng JSON, bạn parse như này:
            ApiResponse<?> errorResponse = objectMapper.readValue(errorBody, ApiResponse.class);

            throw new AppException(ErrorCode.INVALID_REQUEST,
                    errorResponse.getMessage());
        }
    }

    public void updateBillPayed(Long id) {
        Bill bill = getBillById(id);
        if(isEndStatusOfBill(BillStatus.valueOf(bill.getStatus().toUpperCase())))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể cập nhật hóa đơn đã thanh toán hoặc đã hủy");
        bill.setStatus(BillStatus.PAID.getStatus());
        billRepository.save(bill);
    }



    private List<BillDental> getBillDentals(List<ServicesReq> servicesReqs) {
        PriceCostDentalRes priceCostDentalApiRes;
        List<BillDental> billDentals = new ArrayList<>();
        // Thêm các dịch vụ vào billDentals
        ApiResponse<Object> priceCostNameApiRes = null;
        for(ServicesReq servicesReq: servicesReqs) {
            priceCostNameApiRes = dentalClient.getPriceCostOfDental(servicesReq.serviceId());
            dentalClient.getActiveDentalById(servicesReq.serviceId());

            Object result =  priceCostNameApiRes.getResult();
            priceCostDentalApiRes = objectMapper.convertValue(result, PriceCostDentalRes.class);

            billDentals.add(BillDental.builder()
                    .serviceId(servicesReq.serviceId())
                    .servicePrice(BigInteger.valueOf(priceCostDentalApiRes.getPrice()))
                    .serviceCost(BigInteger.valueOf(priceCostDentalApiRes.getCost()))
                    .quantityService(servicesReq.quantityService())
                    .build());
        }
        return billDentals;
    }

    public List<Bill> getAllBill() {
        return billRepository.findAll();
    }
}
