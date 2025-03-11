package com.dental_clinic.auth_service.Service;

import com.dental_clinic.auth_service.Entity.Role;
import com.dental_clinic.auth_service.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    public List<Role> getAllRoles () {
        return roleRepository.findAll();
    }

    public Role getRoleById(Long id) {
        for(Role role:getAllRoles()) {
            if(role.getId() == (id)) return role;
        }
        return null;
    }

    public Role getRoleByName(String name) {
        for(Role role:getAllRoles()) {
            if(role.getName().equalsIgnoreCase(name)) return role;
        }
        return null;
    }

}

