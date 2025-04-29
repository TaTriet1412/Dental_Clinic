package com.dental_clinic.payment_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@Table( name = "bill" )
@NoArgsConstructor
@AllArgsConstructor
public class Bill {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id", nullable = false )
    private Long id;

    @Size( max = 100 )
    @NotNull
    @Column( name = "patient_id", nullable = false, length = 100 )
    private String patientId;

    @Size( max = 100 )
    @NotNull
    @Column( name = "prescription_id", nullable = false, length = 100 )
    private String prescriptionId;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "total_price", nullable = false )
    private BigInteger totalPrice;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "prescription_price", nullable = false )
    private BigInteger prescriptionPrice;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "services_total_price", nullable = false )
    private BigInteger servicesTotalPrice;

    @Size( max = 50 )
    @NotNull
    @Column( name = "status", nullable = false, length = 50 )
    private String status;

    @Size( max = 200 )
    @NotNull
    @ColumnDefault( "''" )
    @Column( name = "note", nullable = false, length = 200 )
    private String note;

    @ColumnDefault( "CURRENT_TIMESTAMP" )
    @Column( name = "created_at" )
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "bill", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<BillDental> billServiceEntities;

}