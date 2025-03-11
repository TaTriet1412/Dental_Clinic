package com.dental_clinic.auth_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class User {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "role_id")
    private Role role;

    @Column
    private String name;

    @Column
    private String address;

    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column(unique = true)
    private String phone;

    @Column
    private LocalDate birthday;

    @Column
    private Integer salary;

    @Column
    private LocalDateTime created_at;

    @Column
    private LocalDateTime last_login;

    @Column
    private boolean gender;

    @Column
    private String img;

    @Column
    private boolean is_active;

    @PrePersist protected void onCreate() {
        LocalDateTime localDateTime = created_at == null ? LocalDateTime.now() : created_at;
    }


}
