package com.dental_clinic.material_service.Repository;

import com.dental_clinic.material_service.Entity.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient,Long> {
    public boolean existsByNameAndIdNot(String name, Long id);
    public boolean existsByName(String name);
    List<Ingredient> findAllByAbleTrue();
}
