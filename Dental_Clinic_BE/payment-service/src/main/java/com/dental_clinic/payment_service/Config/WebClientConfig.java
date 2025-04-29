package com.dental_clinic.dentist_service.Config;

import com.dental_clinic.common_lib.constant.ServiceUrls;
import com.dental_clinic.dentist_service.Client.AccountClient;
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
    public WebClient accountWebClient() {
        return WebClient.builder()
                .baseUrl(ServiceUrls.AUTH_WITH_PORT)
                .filter(filterFunction)
                .build();
    }

    @Bean
    public AccountClient accountClient() {
        WebClientAdapter adapter = WebClientAdapter.create(accountWebClient());
        HttpServiceProxyFactory httpServiceProxyFactory = HttpServiceProxyFactory
                .builder()
                .exchangeAdapter(adapter)
                .build();
        return httpServiceProxyFactory.createClient(AccountClient.class);
    }
}

