package com.dental_clinic.auth_service;

import com.dental_clinic.auth_service.Config.ScheduledTasks;
import com.dental_clinic.auth_service.Service.AuthService;
import com.dental_clinic.common_lib.exception.GlobalExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.boot.autoconfigure.data.redis.RedisRepositoriesAutoConfiguration;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(exclude = {RedisRepositoriesAutoConfiguration.class})
@EnableDiscoveryClient
@EnableScheduling
@Import(GlobalExceptionHandler.class)
public class AuthServiceApplication {

	public static void main(String[] args) {
		ApplicationContext applicationContext = SpringApplication.run(AuthServiceApplication.class, args);
		AuthService authService = applicationContext.getBean(AuthService.class);
		authService.encodeOldPassword();

		ScheduledTasks scheduledTasks = applicationContext.getBean(ScheduledTasks.class);
		scheduledTasks.deleteUnusedImages();
	}

}
