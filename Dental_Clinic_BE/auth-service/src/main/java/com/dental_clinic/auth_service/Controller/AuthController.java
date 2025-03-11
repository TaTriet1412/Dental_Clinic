package com.dental_clinic.auth_service.Controller;

import com.dental_clinic.auth_service.DTO.LoginRequest;
import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Security.JwtResponse;
import com.dental_clinic.auth_service.Security.JwtTokenProvider;
import com.dental_clinic.auth_service.Service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Trả về lỗi nếu có lỗi xác thực
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }
        // Generate JWT token
        User account = authService.tryLogin(loginRequest.getUserId(),loginRequest.getPassword());
        String jwtToken = jwtTokenProvider.generateToken(account);

        // Return the JWT token along with user details (or just the token if preferred)
        return ResponseEntity.ok(new JwtResponse(jwtToken,account));
    }

}
