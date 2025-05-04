package com.dental_clinic.material_service;

import com.dental_clinic.common_lib.exception.GlobalExceptionHandler;
import com.dental_clinic.material_service.Config.ScheduledTasks;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableDiscoveryClient
@EnableScheduling
@Import( GlobalExceptionHandler.class)
public class MaterialServiceApplication {

	public static void main(String[] args) {
		ApplicationContext applicationContext = SpringApplication.run(MaterialServiceApplication.class, args);

		ScheduledTasks scheduledTasks = applicationContext.getBean(ScheduledTasks.class);
		scheduledTasks.deleteUnusedImages();
	}

}
