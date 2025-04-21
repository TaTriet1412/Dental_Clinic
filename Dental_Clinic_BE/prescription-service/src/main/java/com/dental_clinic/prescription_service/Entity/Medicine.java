package com.dental_clinic.prescription_service.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Medicine {
    Long med_id;
    Integer quantity_medicine;
}
