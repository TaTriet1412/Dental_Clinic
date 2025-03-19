package com.dental_clinic.dental_service;

import com.dental_clinic.dental_service.Config.EnvConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class DentalServiceApplication {

	public static void main(String[] args) {
		System.setProperty("MONGO_USERNAME", EnvConfig.getMongoUsername());
		System.setProperty("MONGO_PASSWORD", EnvConfig.getMongoPassword());
		SpringApplication.run(DentalServiceApplication.class, args);
	}

}
