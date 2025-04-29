package com.dental_clinic.payment_service.Config;

import com.dental_clinic.common_lib.constant.ServiceUrls;
import com.dental_clinic.payment_service.Client.DentalClient;
import com.dental_clinic.payment_service.Client.PatientClient;
import com.dental_clinic.payment_service.Client.PrescriptionClient;
import org.springframework.cloud.client.loadbalancer.reactive.LoadBalancedExchangeFilterFunction;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.support.WebClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

@Configuration
public class WebClientConfig {
    private final LoadBalancedExchangeFilterFunction filterFunction;

    public WebClientConfig(LoadBalancedExchangeFilterFunction filterFunction) {
        this.filterFunction = filterFunction;
    }

    @Bean
    public WebClient dentalWebClient() {
        return WebClient.builder()
                .baseUrl(ServiceUrls.DENTAL_WITH_PORT)
                .filter(filterFunction)
                .build();
    }

    @Bean
    public DentalClient dentalClient() {
        WebClientAdapter adapter = WebClientAdapter.create(dentalWebClient());
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(adapter)
                .build();
        return httpServiceProxyFactory.createClient(DentalClient.class);
    }

    @Bean
    public WebClient prescriptionWebClient() {
        return WebClient.builder()
                .baseUrl(ServiceUrls.PRESCRIPTION_WITH_PORT)
                .filter(filterFunction)
                .build();
    }

    @Bean
    public PrescriptionClient prescriptionClient() {
        WebClientAdapter adapter = WebClientAdapter.create(prescriptionWebClient());
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(adapter)
                .build();
        return httpServiceProxyFactory.createClient(PrescriptionClient.class);
    }

    @Bean
    public WebClient patientWebClient() {
        return WebClient.builder()
                .baseUrl(ServiceUrls.PATIENT_WITH_PORT)
                .filter(filterFunction)
                .build();
    }

    @Bean
    public PatientClient patientClient() {
        WebClientAdapter adapter = WebClientAdapter.create(patientWebClient());
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(adapter)
                .build();
        return httpServiceProxyFactory.createClient(PatientClient.class);
    }
}

