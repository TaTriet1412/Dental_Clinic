package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.DTO.Request.CreateAccountInfo;
import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Repository.UserRepository;
import com.dental_clinic.auth_service.Security.JwtTokenProvider;
import com.dental_clinic.auth_service.Utils.FieldUtils;
import com.dental_clinic.auth_service.Utils.VariableUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);



    public User tryLogin(String userId, String password) {
        // userId có thể là email hoặc số điện thoại
        for(User user:userService.getUsers()){
            if((user.getEmail().equals(userId) || user.getPhone().equals(userId)) &&
                    passwordEncoder.matches(password,user.getPassword())){
                if (user.is_ban()){
                    throw new RuntimeException("Tài khoản đã bị khóa");
                }
                user.set_active(true);
                user.setLast_login(LocalDateTime.now());
                userRepository.save(user);
                return user;
            }
        }
        throw new RuntimeException("Thông tin đăng nhập không chính xác");
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

    public void createAccount(CreateAccountInfo userInfo) {
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getName(), "Họ tên");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getRoleId(), "Vai trò");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getAddress(), "Địa chỉ");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getSalary(), "Lương");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getEmail(), "Email");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getBirthDate(), "Ngày sinh");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.getPhone(), "Số điện thoại");
        FieldUtils.checkFieldIsEmptyOrNull(userInfo.isGender(), "Giới tính");



        if (userRepository.existsByEmail(userInfo.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (userRepository.existsByPhone(userInfo.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        if (userRepository.existsByName(userInfo.getName())) {
            throw new RuntimeException("Tên đã tồn tại");
        }
        if(!FieldUtils.isValidEmail(userInfo.getEmail())) {
            throw new RuntimeException("Email không hợp lệ");
        }
        if(Objects.equals(userInfo.getRoleId(), VariableUtils.DEFAULT_ADMIN_ID)) {
            throw new RuntimeException("Không thể thêm chức vụ quản lí");
        }
        FieldUtils.checkNumberIsIntegerAndNotNegative(userInfo.getSalary());


        userRepository.save(
                 User.builder()
                        .role(roleService.getRoleById(userInfo.getRoleId()))
                        .email(userInfo.getEmail())
                        .password(passwordEncoder.encode(VariableUtils.DEFAULT_PASSWORD))
                        .name(userInfo.getName())
                        .birthday(userInfo.getBirthDate())
                        .phone(userInfo.getPhone())
                        .address(userInfo.getAddress())
                        .is_ban(false)
                        .is_active(false)
                        .salary(userInfo.getSalary())
                        .img(VariableUtils.DEFAULT_AVATAR)
                        .gender(userInfo.isGender())
                        .created_at(LocalDateTime.now())
                        .build()
        );
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
            throw new RuntimeException("Không thể khóa tài khoản quản lí");
        return userRepository.save(u);
    }

    public User resetPassword(Long userId) {
        User u = userService.getById(userId);
        u.setPassword(passwordEncoder.encode(VariableUtils.DEFAULT_PASSWORD));
        return userRepository.save(u);
    }
}
