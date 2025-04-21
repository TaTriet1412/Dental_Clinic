package com.dental_clinic.prescription_service.Entity;
import jakarta.persistence.Lob;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "prescriptions")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Prescription {
    @Id
    String id;
    Long pat_id;
    Long den_id;
    Long bill_id;
    Boolean is_deleted;
    @Lob
    String note;
    BigInteger total_price;
    LocalDateTime created_at;
    List<Medicine> medicines;
}
