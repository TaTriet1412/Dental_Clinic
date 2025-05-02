package com.dental_clinic.auth_service.Security;

import com.dental_clinic.auth_service.Entity.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtResponse {

    private String token;
    private String name;
    private String email;
    private String role;
    private Long userId;

    public JwtResponse(String token, User user) {
        this.token = token;
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().getName();
        this.userId = user.getId();
    }
}