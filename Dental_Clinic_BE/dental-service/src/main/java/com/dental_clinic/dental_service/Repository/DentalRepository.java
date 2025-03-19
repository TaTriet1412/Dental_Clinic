package com.dental_clinic.dental_service.Repository;

import com.dental_clinic.dental_service.Entity.Dental;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DentalRepository extends MongoRepository<Dental, String> {
    public boolean existsByCategoryId(String id);
    boolean existsByName(String name);
    @Query(value = "{ $and: [ { 'name': ?0 }, { '_id': { $ne: ?1 } } ] }", exists = true)
    boolean existsByNameAndNameNot(String name, String excludeId);
}
