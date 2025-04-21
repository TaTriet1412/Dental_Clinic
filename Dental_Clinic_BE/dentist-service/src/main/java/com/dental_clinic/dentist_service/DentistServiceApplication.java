package com.dental_clinic.dentist_service;

import com.dental_clinic.common_lib.exception.GlobalExceptionHandler;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@EnableDiscoveryClient
@Import(GlobalExceptionHandler.class)
public class DentistServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DentistServiceApplication.class, args);
	}

}
