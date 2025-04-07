package com.dental_clinic.material_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "consumable_material")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ConsumableMaterial {
    @Id
    private Long id;

    public ConsumableMaterial(Long id) {
        this.id = id;
    }

    @ManyToMany
    @JoinTable(
            name = "ingredient_consumable_material",
            joinColumns = @JoinColumn(name = "con_mat_id"),
            inverseJoinColumns = @JoinColumn(name = "ingredient_id")
    )
    private List<Ingredient> ingredientList;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "id")
    private Material material;

    @OneToOne(mappedBy = "consumableMaterial", fetch = FetchType.LAZY)
    @JsonIgnore
    private Medicine medicine;
}
