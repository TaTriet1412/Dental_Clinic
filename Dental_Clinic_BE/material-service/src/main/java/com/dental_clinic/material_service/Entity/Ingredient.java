package com.dental_clinic.material_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ingredient")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Column
    @CreationTimestamp
    private LocalDateTime created_at;

    @Column
    private boolean able;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
            name = "ingredient_consumable_material",
            joinColumns = @JoinColumn(name = "ingredient_id"),
            inverseJoinColumns = @JoinColumn(name = "con_mat_id")
    )
    private List<ConsumableMaterial> consumableMaterialList;

}
