package com.dental_clinic.auth_service.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

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

    @ManyToOne(fetch = FetchType.LAZY)
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

    @Column(name="created_at")
    @CreationTimestamp
    private LocalDateTime created_at;

    @Column
    private LocalDateTime last_login;

    @Column
    private boolean gender;

    @Column
    private String img;

    @Column
    private boolean is_active;

    @Column
    private boolean is_ban;
}
