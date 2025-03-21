package com.dental_clinic.material_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fixed_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class FixedMaterial {
    @Id
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "id")
    private Material material;

    public FixedMaterial(Long id) {
        this.id = id;
    }
}
