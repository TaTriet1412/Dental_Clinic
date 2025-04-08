package com.dental_clinic.dental_service.Repository;

import com.dental_clinic.dental_service.Entity.Dental;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;



@Repository
public interface DentalRepository extends MongoRepository<Dental, String> {
    public boolean existsByCategoryId(String id);
    boolean existsByName(String name);
    @Query(value = "{ $and: [ { 'name': ?0 }, { '_id': { $ne: ?1 } } ] }", exists = true)
    boolean existsByNameAndNameNot(String name, String excludeId);
    Optional<Dental> findByImg(String imgUrl);
    @Aggregation(pipeline = {
            "{ $project: { _id: 0, img: 1 } }"
    })
    List<String> findAllImg();

}
