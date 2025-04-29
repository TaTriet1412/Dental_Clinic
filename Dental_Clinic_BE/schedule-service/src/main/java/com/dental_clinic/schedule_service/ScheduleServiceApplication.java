package com.dental_clinic.schedule_service;

import com.dental_clinic.common_lib.exception.GlobalExceptionHandler;
import com.dental_clinic.schedule_service.Config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableDiscoveryClient
@Import({GlobalExceptionHandler.class})
@EnableAsync
public class ScheduleServiceApplication {

	public static void main(String[] args) {
		System.setProperty("MONGO_USERNAME", EnvConfig.getMongoUsername());
		System.setProperty("MONGO_PASSWORD", EnvConfig.getMongoPassword());
		ApplicationContext applicationContext = SpringApplication.run(ScheduleServiceApplication.class, args);

	}
}
