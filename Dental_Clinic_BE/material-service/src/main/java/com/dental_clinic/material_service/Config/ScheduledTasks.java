package com.dental_clinic.material_service.Config;

import com.dental_clinic.material_service.Service.MaterialService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class ScheduledTasks {

    private final MaterialService materialService;

//    @Scheduled(cron = "5 1 0 ? * 2,4,6", zone = "Asia/Ho_Chi_Minh")
    public void deleteUnusedImages() {
        materialService.SYSTEM_scanAndDeleteUnusedImgs();
    }

}
