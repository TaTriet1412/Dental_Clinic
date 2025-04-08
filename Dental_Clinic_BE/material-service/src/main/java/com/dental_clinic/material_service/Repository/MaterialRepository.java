package com.dental_clinic.material_service.Repository;

import com.dental_clinic.material_service.Entity.Category;
import com.dental_clinic.material_service.Entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MaterialRepository extends JpaRepository<Material,Long> {
    public boolean existsByName(String name);
    public boolean existsByNameAndIdNot(String name, Long id);
    public boolean existsByCategory(Category category);
    Optional<Material> findByImg(String imgUrl);
    @Query("SELECT m.img FROM Material m")
    List<String> findAllImg();
}
