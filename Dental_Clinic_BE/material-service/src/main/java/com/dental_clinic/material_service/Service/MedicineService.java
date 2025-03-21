package com.dental_clinic.material_service.Service;

import com.dental_clinic.material_service.DTO.CreateMedicineDTO;
import com.dental_clinic.material_service.DTO.UpdateMedicineDTO;
import com.dental_clinic.material_service.Entity.Category;
import com.dental_clinic.material_service.Entity.ConsumableMaterial;
import com.dental_clinic.material_service.Entity.Material;
import com.dental_clinic.material_service.Entity.Medicine;
import com.dental_clinic.material_service.Repository.MedicineRepository;
import com.dental_clinic.material_service.Utils.FieldUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {
    @Autowired
    private MedicineRepository medicineRepository;
    @Autowired
    private static ConsumableMaterialService consumableMaterialService;

    public List<Medicine> getAll() {
        return medicineRepository.findAll();
    }

    public Medicine getById(Long id) {
        return medicineRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Không tìm thấy thuốc có id = '" + id + "'"));
    }

    public Medicine createMedicine(CreateMedicineDTO req) {
        //        Kiểm tra trường thông tin có sai định dạng không
        FieldUtils.checkFieldIsEmptyOrNull(req.getId(),"Mã thuốc");
        FieldUtils.checkFieldIsEmptyOrNull(req.getCared_actor(),"Đối tượng chăm sóc");
        FieldUtils.checkFieldIsEmptyOrNull(req.getInstruction(),"Hướng dẫn sử dụng");
        FieldUtils.checkFieldIsEmptyOrNull(req.getCost(),"Chi phí");
        FieldUtils.checkFieldIsEmptyOrNull(req.getRevenue(),"Giá");

        FieldUtils.checkNumberIsIntegerAndNotNegative(req.getRevenue());
        FieldUtils.checkNumberIsIntegerAndNotNegative(req.getCost());

        if(req.getRevenue() < req.getCost())
            throw new RuntimeException("Chi phí không được lớn hơn giá vật liệu");

//        Kiểm tra id phân loại / vật liệu tiêu hao có tồn tại không
        checkAbleConMaterialAndCategory(req.getId());

        return medicineRepository.save(
                Medicine.builder()
                        .id(req.getId())
                        .cost(req.getCost())
                        .revenue(req.getRevenue())
                        .instruction(req.getInstruction())
                        .cared_actor(req.getCared_actor())
                        .build()
        );
    }

    public Medicine updateMedicine(UpdateMedicineDTO req, Long id) {
//        Lấy loại thuốc cần điều chỉnh
        Medicine medicine = getById(id);

//        Kiểm tra thuộc tính
        Optional.ofNullable(req.cared_actor())
                .ifPresent( cared_actor ->{
                    FieldUtils.checkStrEmpty(cared_actor,"Đối tượng chăm sóc");
                    medicine.setCared_actor(cared_actor);
                });

        Optional.ofNullable(req.cost())
                .ifPresent( cost ->{
                    FieldUtils.checkNumberIsIntegerAndNotNegative(cost);
                    medicine.setCost(cost);
                });

        Optional.ofNullable(req.revenue())
                .ifPresent( revenue ->{
                    FieldUtils.checkNumberIsIntegerAndNotNegative(revenue);
                    medicine.setRevenue(revenue);
                });

        Optional.ofNullable(req.instruction())
                .ifPresent( instruction ->{
                    FieldUtils.checkStrEmpty(instruction,"Hướng dẫn sử dụng");
                    medicine.setInstruction(instruction);
                });

        checkAbleConMaterialAndCategory(id);

        if(req.revenue() < req.cost())
            throw new RuntimeException("Chi phí không được lớn hơn giá thuốc");

        return medicineRepository.save(medicine);
    }

    public static void checkAbleConMaterialAndCategory(Long conId) {
        ConsumableMaterial consumableMaterial = consumableMaterialService.getById(conId);
        Material parentMaterial = consumableMaterial.getMaterial();
        Category parentCategory = parentMaterial.getCategory();

        boolean isAbleOfConMaterial = parentMaterial.isAble();
        boolean isAbleOfCat = parentCategory.isAble();

        if (!isAbleOfConMaterial)
            throw new RuntimeException("Vật liệu tiêu hao '" + parentMaterial + "'" + " đã đóng");
        if (!isAbleOfCat)
            throw new RuntimeException("Phân loại vật liệu '" + parentMaterial + "'" + " đã đóng");
    }
}
