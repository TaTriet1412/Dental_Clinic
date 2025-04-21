package com.dental_clinic.auth_service.Repository;

import com.dental_clinic.auth_service.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public boolean existsByEmailAndIdNot(String email, Long id);
    public boolean existsByPhoneAndIdNot(String phone, Long id);
    public boolean existsByNameAndIdNot(String name, Long id);
    public boolean existsByEmail(String email);
    public boolean existsByPhone(String phone);
    public boolean existsByName(String name);
    Optional<User> findByImg(String imgUrl);
    @Query("SELECT u.img FROM User u")
    List<String> findAllImg();
    void deleteByEmail(String email);

    Optional<Object> findByEmail(String email);
}
