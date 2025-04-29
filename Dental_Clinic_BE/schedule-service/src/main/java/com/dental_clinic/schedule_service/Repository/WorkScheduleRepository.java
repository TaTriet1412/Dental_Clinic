package com.dental_clinic.schedule_service.Repository;

import com.dental_clinic.schedule_service.Entity.WorkSchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkScheduleRepository extends MongoRepository<WorkSchedule, String> {
    @Query("{ 'user_id': ?0}")
    List<WorkSchedule> findAllByUserId(Long user_id);
    @Query("{ 'user_id': ?0, '_id': { $ne: ?1 } }")
    List<WorkSchedule> findAllByUserIdAndIdNot(Long user_id, String id);
    @Query("{ 'user_id': ?0, 'time_start': { $gte: ?1, $lte: ?2 } }")
    List<WorkSchedule> findAllByUserIdAndTimeStartBetween(Long user_id, LocalDateTime time_start, LocalDateTime time_end);
}
