package com.dental_clinic.auth_service.Controller;

import com.dental_clinic.auth_service.DTO.Request.*;
import com.dental_clinic.auth_service.DTO.Response.AccountUpdateRes;
import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Security.JwtResponse;
import com.dental_clinic.auth_service.Security.JwtTokenProvider;
import com.dental_clinic.auth_service.Service.AuthService;
import com.dental_clinic.auth_service.Service.UserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    @Lazy
    private AuthService authService;
    @Autowired
    @Lazy
    private UserService userService;
    private final Gson gson = new GsonBuilder()
            .disableHtmlEscaping()
            .create();

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

    @PostMapping("/create_account")
    public ResponseEntity<?> createAccount(@RequestBody CreateAccountInfo userInfo) {
        authService.createAccount(userInfo);
        return ResponseEntity.ok(gson.toJson("Tạo tài khoản thành công"));
    }

    @PutMapping("/update_account")
    public ResponseEntity<AccountUpdateRes> register(@RequestBody UpdateAccount req) {
        return ResponseEntity.ok(userService.updateAccountInfo(req));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest logoutDTO) {
        authService.logout(logoutDTO.getEmail());
        return ResponseEntity.ok(gson.toJson("Đăng xuất thành công"));
    }

    @PatchMapping("/toggle_ban/{id}")
    public ResponseEntity<?> toggleBanUser(@PathVariable Long id) {
        User u = authService.toggleBanUser(id);
        return ResponseEntity.ok(
                gson.toJson(
                        u.is_ban() ?
                                "Đã khóa tài khoản người dùng id = '" + u.getId().toString() + "'" :
                                "Mở khóa tài khoản người dùng id = '" + u.getId().toString() + "'"
                ));
    }

    @PatchMapping("/reset_password/{id}")
    public ResponseEntity<?> resetPasswordUser(@PathVariable Long id) {
        User u = authService.resetPassword(id);
        return ResponseEntity.ok(gson.toJson("Đã khôi phục mật khẩu mặc định cho user có id ='" + u.getId().toString() +"'"));
    }

    //    Đổi ảnh
    @PutMapping(value = "/change-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> changeImg(@ModelAttribute ChangeAuthServiceImageRequest request) {
        userService.changeImg(request);
        return new ResponseEntity<>(gson.toJson("Thay đổi thành công"), HttpStatus.OK);
    }

}
