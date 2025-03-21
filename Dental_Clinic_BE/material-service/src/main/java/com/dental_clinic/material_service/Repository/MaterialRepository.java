package com.dental_clinic.material_service.Repository;

import com.dental_clinic.material_service.Entity.Category;
import com.dental_clinic.material_service.Entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material,Long> {
    public boolean existsByName(String name);
    public boolean existsByNameAndIdNot(String name, Long id);
    public boolean existsByCategory(Category category);
}
