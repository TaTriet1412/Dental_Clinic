package com.dental_clinic.auth_service.Controller;

import com.dental_clinic.auth_service.DTO.Request.*;
import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Security.JwtResponse;
import com.dental_clinic.auth_service.Security.JwtTokenProvider;
import com.dental_clinic.auth_service.Service.AuthService;
import com.dental_clinic.auth_service.Service.UserService;
import com.dental_clinic.common_lib.dto.response.ApiResponse;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/auth")
@Validated
public class AuthController {
    private JwtTokenProvider jwtTokenProvider;
    @Lazy
    private AuthService authService;
    @Lazy
    private UserService userService;
    private final Gson gson = new GsonBuilder()
            .disableHtmlEscaping()
            .create();

    @Autowired
    public AuthController(JwtTokenProvider jwtTokenProvider, AuthService authService, UserService userService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ApiResponse<Object> loginUser(@Valid @RequestBody LoginRequest loginRequest, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            // Trả về lỗi nếu có lỗi xác thực
            throw new AppException(ErrorCode.INVALID_REQUEST, bindingResult.getAllErrors().toString());
        }
        // Generate JWT token
        User account = authService.tryLogin(loginRequest.getUserId(),loginRequest.getPassword());
        String jwtToken = jwtTokenProvider.generateToken(account);

        // Return the JWT token along with user details (or just the token if preferred)
        return ApiResponse.builder()
                .result(new JwtResponse(jwtToken,account))
                .apiCode(200)
                .message("Đăng nhập thành công!")
                .build();
    }

    @PutMapping("/update_account")
    public ApiResponse<Object> updateAccount(@Valid @RequestBody UpdateAccount req) {
        return ApiResponse.builder()
                .message("Cập nhật tài khoản thành công")
                .apiCode(200)
                .result(userService.updateAccountInfo(req))
                .build();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create_account")
    public ApiResponse<Object> createAccount(@Valid @RequestBody CreateAccountInfo userInfo) {
        return ApiResponse.builder()
                .message("Tạo tài khoản thành công")
                .apiCode(HttpStatus.CREATED.value())
                .result(authService.createAccount(userInfo)).build();
    }

    @DeleteMapping("/delete_account")
    public ApiResponse<?> deleteAccount(@Valid @RequestBody DeleteAccount req) {
        authService.deleteByEmail(req.email());
        return ApiResponse.builder()
                .message("Xóa tài khoản thành công")
                .apiCode(200).build();
    }

    @PostMapping("/logout")
    public ApiResponse<Object> logout(@RequestBody LogoutRequest logoutDTO) {
        authService.logout(logoutDTO.getEmail());
        return ApiResponse.builder()
                .message("Đăng xuất thành công")
                .apiCode(200)
                .build();
    }

    @PutMapping("/toggle_ban/{id}")
    public ApiResponse<Object> toggleBanUser(@PathVariable Long id) {
        User u = authService.toggleBanUser(id);
        return ApiResponse.builder()
                .message(u.is_ban() ?
                        "Đã khóa tài khoản người dùng id = '" + u.getId().toString() + "'" :
                        "Mở khóa tài khoản người dùng id = '" + u.getId().toString() + "'")
                .apiCode(200)
                .build();
    }

    @PutMapping("/reset_password/{id}")
    public ApiResponse<Object> resetPasswordUser(@PathVariable Long id) {
        User u = authService.resetPassword(id);
        return ApiResponse.builder()
                .message("Đã khôi phục mật khẩu mặc định cho user có id ='" + u.getId().toString() + "'")
                .apiCode(200)
                .build();
    }

    //    Đổi ảnh
    @PutMapping(value = "/change-img", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Object> changeImg(@ModelAttribute ChangeAuthServiceImageRequest request) {
        userService.changeImg(request);
        return ApiResponse.builder()
                .message("Thay đổi thành công")
                .apiCode(200)
                .build();
    }

}
