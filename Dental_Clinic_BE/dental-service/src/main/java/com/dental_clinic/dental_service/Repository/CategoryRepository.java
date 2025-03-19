package com.dental_clinic.dental_service.Repository;

import com.dental_clinic.dental_service.Entity.Category;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends MongoRepository<Category, String> {
    boolean existsByName(String name);
    @Query(value = "{ $and: [ { 'name': ?0 }, { '_id': { $ne: ?1 } } ] }", exists = true)
    boolean existsByNameAndNameNot(String name, String excludeId);
}
