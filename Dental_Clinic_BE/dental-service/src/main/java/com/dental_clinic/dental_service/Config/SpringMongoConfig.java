package com.dental_clinic.dental_service.Config;


import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.convert.DefaultMongoTypeMapper;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;

@Configuration
@RequiredArgsConstructor
public class SpringMongoConfig{

    private final ApplicationContext applicationContext;

    @PostConstruct
    public void init(){

        //remove _class
        MappingMongoConverter converter = applicationContext.getBean(MappingMongoConverter.class);
        converter.setTypeMapper(new DefaultMongoTypeMapper(null));
    }
}
