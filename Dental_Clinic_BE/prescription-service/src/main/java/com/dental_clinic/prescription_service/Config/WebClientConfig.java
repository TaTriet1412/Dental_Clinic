package com.dental_clinic.prescription_service.Config;

import com.dental_clinic.common_lib.constant.ServiceUrls;
import com.dental_clinic.prescription_service.Client.MaterialClient;
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
    public WebClient materialWebClient() {
        return WebClient.builder()
                .baseUrl(ServiceUrls.MATERIAL_WITH_PORT)
                .filter(filterFunction)
                .build();
    }

    @Bean
    public MaterialClient materialClient() {
        WebClientAdapter adapter = WebClientAdapter.create(materialWebClient());
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(adapter)
                .build();
        return httpServiceProxyFactory.createClient(MaterialClient.class);
    }
}

