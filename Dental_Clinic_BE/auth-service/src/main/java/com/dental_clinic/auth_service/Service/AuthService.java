package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.DTO.Request.CreateAccountInfo;
import com.dental_clinic.auth_service.DTO.Response.AccountCreateRes;
import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Repository.UserRepository;
import com.dental_clinic.auth_service.Security.JwtTokenProvider;
import com.dental_clinic.auth_service.Utils.FieldUtils;
import com.dental_clinic.auth_service.Utils.VariableUtils;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final RoleService roleService;
    private final JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public AuthService(JwtTokenProvider jwtTokenProvider, UserRepository userRepository, UserService userService, RoleService roleService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.userService = userService;
        this.roleService = roleService;
    }


    public User tryLogin(String userId, String password) {
        // userId có thể là email hoặc số điện thoại
        for(User user:userService.getUsers()){
            if((user.getEmail().equals(userId) || user.getPhone().equals(userId)) &&
                    passwordEncoder.matches(password,user.getPassword())){
                if (user.is_ban()){
                    throw new AppException(ErrorCode.DATA_OFF, "Tài khoản đã bị khóa");
                }
                user.set_active(true);
                user.setLast_login(LocalDateTime.now());
                userRepository.save(user);
                return user;
            }
        }
        throw new AppException(ErrorCode.INVALID_CREDENTIALS, "Thông tin đăng nhập không chính xác");
    }

    public void encodePassword(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public void encodeOldPassword(){
        List<User> userList = userService.getUsers();
        for(User user:userList){
            if (!user.getPassword().startsWith("$2a$") &&
                    !user.getPassword().startsWith("$2b$") &&
                    !user.getPassword().startsWith("$2y$")){
                encodePassword(user);
            }
        }
    }

    public AccountCreateRes createAccount(CreateAccountInfo req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Email đã tồn tại");
        }
        if (userRepository.existsByPhone(req.phone())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Số điện thoại đã tồn tại");
        }
        if (userRepository.existsByName(req.name())) {
            throw new AppException(ErrorCode.EXISTED_DATA, "Tên đã tồn tại");
        }
        if (!FieldUtils.isValidEmail(req.email())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Email không hợp lệ");
        }
        if (Objects.equals(req.roleId(), VariableUtils.DEFAULT_ADMIN_ID)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể thêm chức vụ quản lí");
        }
        FieldUtils.checkNumberIsIntegerAndNotNegative(req.salary());

        User user = getSavedUserByCreate(req);
        return new AccountCreateRes(user.getId(),user.getEmail());
    }

    private User getSavedUserByCreate(CreateAccountInfo req) {
        return userRepository.save(
                User.builder()
                        .role(roleService.getRoleById(req.roleId()))
                        .email(req.email())
                        .password(passwordEncoder.encode(VariableUtils.DEFAULT_PASSWORD))
                        .name(req.name())
                        .birthday(req.birthDate())
                        .phone(req.phone())
                        .address(req.address())
                        .is_ban(false)
                        .is_active(false)
                        .salary(req.salary())
                        .img(VariableUtils.DEFAULT_AVATAR)
                        .gender(req.gender())
                        .created_at(LocalDateTime.now())
                        .build()
        );
    }

    @Transactional
    public void deleteByEmail(String email) {
        userRepository.deleteByEmail(email);
    }

    public void logout(String email) {
        User user = userService.getUserByEmail(email);
        jwtTokenProvider.logout(email);
        user.set_active(false);
        userRepository.save(user);
    }

    public User toggleBanUser(Long userId) {
        User u = userService.getById(userId);
        u.set_ban(!u.is_ban());
        if(Objects.equals(u.getId(), VariableUtils.DEFAULT_ADMIN_ID))
            throw new AppException(ErrorCode.INVALID_REQUEST, "Không thể khóa tài khoản quản lí");
        return userRepository.save(u);
    }

    public User resetPassword(Long userId) {
        User u = userService.getById(userId);
        u.setPassword(passwordEncoder.encode(VariableUtils.DEFAULT_PASSWORD));
        return userRepository.save(u);
    }
}
