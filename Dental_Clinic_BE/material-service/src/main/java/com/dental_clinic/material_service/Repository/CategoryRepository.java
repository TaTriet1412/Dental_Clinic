package com.dental_clinic.material_service.Repository;

import com.dental_clinic.material_service.Entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {
    public boolean existsByName(String name);
    public boolean existsByNameAndIdNot(String name, Long id);
}
