package com.dental_clinic.dentist_service.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "dentist")
public class Dentist {
    @Id
    @Column(name = "id")
    private Long id;

    @NotNull
    @Lob
    @Column(name = "specialty", nullable = false)
    private String specialty;

    @NotNull
    @Column(name = "experience_year", nullable = false)
    private Integer experienceYear;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fac_id", nullable = false)
    @JsonBackReference
    private Faculty faculty;
}