package com.dental_clinic.patient_service.Config;

import com.dental_clinic.patient_service.Service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor
public class ScheduledTasks {

    private final PatientService patientService;

    @Scheduled(cron = "5 1 0 ? * 2,4,6", zone = "Asia/Ho_Chi_Minh")
    public void deleteUnusedImages() {
        patientService.SYSTEM_scanAndDeleteUnusedImgs();
    }

}
