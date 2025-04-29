package com.dental_clinic.patient_service;

import com.dental_clinic.common_lib.exception.GlobalExceptionHandler;
import com.dental_clinic.patient_service.Config.EnvConfig;
import com.dental_clinic.patient_service.Config.ScheduledTasks;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
@Import({GlobalExceptionHandler.class})
public class PatientServiceApplication {

	public static void main(String[] args) {
		System.setProperty("MONGO_USERNAME", EnvConfig.getMongoUsername());
		System.setProperty("MONGO_PASSWORD", EnvConfig.getMongoPassword());
		ApplicationContext applicationContext = SpringApplication.run(PatientServiceApplication.class, args);

		ScheduledTasks scheduledTasks = applicationContext.getBean(ScheduledTasks.class);
		scheduledTasks.deleteUnusedImages();
	}

}
