package com.dental_clinic.material_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "medicine")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Medicine {
    @Id
    private Long id;

    @Column
    private int cost;

    @Column
    private int revenue;

    @Column(columnDefinition = "LONGTEXT")
    private String cared_actor;

    @Column(columnDefinition = "LONGTEXT")
    private String instruction;

    @Column
    @CreationTimestamp
    private LocalDateTime created_at;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "id")
    private ConsumableMaterial consumableMaterial;
}
