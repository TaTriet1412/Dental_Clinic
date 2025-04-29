package com.dental_clinic.payment_service.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table( name = "payment_transaction" )
public class PaymentTransaction {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id", nullable = false )
    private Long id;

    @NotNull
    @ColumnDefault( "0" )
    @Column( name = "amount_paid", nullable = false )
    private Integer amountPaid;

    @Size( max = 100 )
    @ColumnDefault( "'vnpay'" )
    @Column( name = "payment_method", length = 100 )
    private String paymentMethod;

    @Size( max = 50 )
    @NotNull
    @Column( name = "status", nullable = false, length = 50 )
    private String status;

    @ColumnDefault( "CURRENT_TIMESTAMP" )
    @Column( name = "created_at" )
    private Instant createdAt;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "bill_id")
    @JsonBackReference
    private Bill bill;

}