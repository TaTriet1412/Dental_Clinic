package com.dental_clinic.dental_service.Config;

import com.dental_clinic.dental_service.Service.DentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class ScheduledTasks {
    @Lazy
    private final DentalService dentalService;

    @Scheduled(cron = "5 1 0 ? * 2,4,6", zone = "Asia/Ho_Chi_Minh")
    public void deleteUnusedImages() {
        dentalService.SYSTEM_scanAndDeleteUnusedImgs();
    }

}
