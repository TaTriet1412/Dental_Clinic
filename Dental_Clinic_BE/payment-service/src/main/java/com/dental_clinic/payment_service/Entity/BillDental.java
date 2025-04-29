package com.dental_clinic.payment_service.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.math.BigInteger;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table( name = "bill_service" )
public class BillDental {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id", nullable = false )
    private Long id;

    @Size( max = 100 )
    @NotNull
    @Column( name = "service_id", nullable = false, length = 100 )
    private String serviceId;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "service_cost", nullable = false )
    private BigInteger serviceCost;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "quantity_service", nullable = false )
    private Integer quantityService;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "service_price", nullable = false )
    private BigInteger servicePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    @JsonBackReference
    private Bill bill;
}