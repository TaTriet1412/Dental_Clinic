package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.Entity.Role;
import com.dental_clinic.auth_service.Repository.RoleRepository;
import com.dental_clinic.common_lib.exception.AppException;
import com.dental_clinic.common_lib.exception.ErrorCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;


@Service
public class RoleService {
    private final RoleRepository roleRepository;

    @Autowired
    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public List<Role> getAllRoles () {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        for(Role role:getAllRoles()) {
            if(Objects.equals(role.getId(), id)) return role;
        }
        return null;
    }

    public Role getRoleByName(String name) {
        for(Role role:getAllRoles()) {
            if(role.getName().equalsIgnoreCase(name)) return role;
        }
        throw new AppException(ErrorCode.INVALID_REQUEST,"Vai trò không khả dụng. (không phân biệt hoa thường)");
    }
}

