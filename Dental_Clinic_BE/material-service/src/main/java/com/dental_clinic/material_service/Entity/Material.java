package com.dental_clinic.material_service.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    private Integer quantity;

    @Column
    private String unit;

    @Column(columnDefinition = "LONGTEXT")
    private String func;

    @Column
    private LocalDate mfg_date;

    @Column
    private String img;

    @Column
    @CreationTimestamp
    private LocalDateTime created_at;

    @Column
    private boolean able;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @JsonBackReference
    private Category category;

    public Long getCategoryId() { return category != null ? category.getId() : null; }

    @OneToOne(mappedBy = "material", fetch = FetchType.LAZY)
    @JsonIgnore
    private FixedMaterial fixedMaterial;

    @OneToOne(mappedBy = "material", fetch = FetchType.LAZY)
    @JsonIgnore
    private ConsumableMaterial consumableMaterial;
}
