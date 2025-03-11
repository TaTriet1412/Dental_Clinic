package com.dental_clinic.auth_service;

import com.dental_clinic.auth_service.Service.AuthService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;

@SpringBootApplication
@EnableDiscoveryClient
public class AuthServiceApplication {

	public static void main(String[] args) {
		ApplicationContext applicationContext = SpringApplication.run(AuthServiceApplication.class, args);
		AuthService authService = applicationContext.getBean(AuthService.class);
		authService.encodeOldPassword();
	}

}
