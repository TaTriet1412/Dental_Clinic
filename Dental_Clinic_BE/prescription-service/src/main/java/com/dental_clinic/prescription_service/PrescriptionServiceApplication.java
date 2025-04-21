package com.dental_clinic.prescription_service;

import com.dental_clinic.common_lib.exception.GlobalExceptionHandler;
import com.dental_clinic.prescription_service.Config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableDiscoveryClient
@Import(GlobalExceptionHandler.class)
public class PrescriptionServiceApplication {

	public static void main(String[] args) {
		System.setProperty("MONGO_USERNAME", EnvConfig.getMongoUsername());
		System.setProperty("MONGO_PASSWORD", EnvConfig.getMongoPassword());
		ApplicationContext applicationContext = SpringApplication.run(PrescriptionServiceApplication.class, args);
	}

}
