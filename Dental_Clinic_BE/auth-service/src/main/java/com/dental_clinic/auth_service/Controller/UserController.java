package com.dental_clinic.auth_service.Controller;

import com.dental_clinic.auth_service.Service.UserService;
import com.dental_clinic.common_lib.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/user")
@Validated
public class UserController {
    UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/role/{roleId}")
    public ApiResponse<Object> getNameAndIdOfUserByRoleId(@PathVariable Long roleId) {
        return ApiResponse.builder()
                .result(userService.getNameAndIdOfEmployeeByRoleId(roleId))
                .apiCode(200)
                .message("Lấy danh sách nhân viên thành công!")
                .build();
    }
}
