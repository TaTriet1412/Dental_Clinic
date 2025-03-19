package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.DTO.CreateAccountInfo;
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
        if (userService.existsByEmail(userInfo.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        else if (userService.existsByPhone(userInfo.getPhone())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        if(!FieldUtils.isValidEmail(userInfo.getEmail())) {
            throw new RuntimeException("Email không hợp lệ");
        }
        userRepository.save(
                User.builder()
                        .role(roleService.getRoleByName(userInfo.getRole().toUpperCase()))
                        .email(userInfo.getEmail())
                        .password(passwordEncoder.encode(userInfo.getPassword()))
                        .name(userInfo.getName())
                        .birthday(userInfo.getBirthDate())
                        .phone(userInfo.getPhone())
                        .address(userInfo.getAddress())
                        .is_active(true)
                        .salary(userInfo.getSalary())
                        .img(VariableUtils.DEFAULT_AVATAR)
                        .build()
        );
    }

    public void logout(String email) {
        User user = userService.getUserByEmail(email);
        jwtTokenProvider.logout(email);
        user.set_active(false);
        userRepository.save(user);
    }
}
