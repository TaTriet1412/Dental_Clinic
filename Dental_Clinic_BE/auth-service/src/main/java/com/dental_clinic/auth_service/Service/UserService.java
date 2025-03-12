package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.Entity.User;
import com.dental_clinic.auth_service.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getUsers(){
        return userRepository.findAll();
    }

    public User getUserByEmail(String email) {
        for (User user: getUsers()) {
            if(user.getEmail().equals(email)) return user;
        }
        throw  new RuntimeException("Không tồn tại email này!");
    }

    public boolean existsByEmail(String email) {
        for(User user:getUsers()) {
            if(user.getEmail().equals(email)) {
                return true;
            }
        }
        return false;
    }

    public boolean existsByPhone(String phone) {
        for(User user:getUsers()) {
            if(user.getPhone().equals(phone)) {
                return true;
            }
        }
        return false;
    }
}
