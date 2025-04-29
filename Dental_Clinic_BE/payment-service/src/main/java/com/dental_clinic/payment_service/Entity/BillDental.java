package com.dental_clinic.payment_service.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table( name = "bill_service" )
public class BillService {
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
    private Integer serviceCost;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "quantity_service", nullable = false )
    private Integer quantityService;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "service_price", nullable = false )
    private Integer servicePrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    @JsonBackReference
    private Bill bill;
}