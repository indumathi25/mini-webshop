package com.webshop.backend.config;

import org.springframework.boot.jackson.autoconfigure.JsonMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.web.config.SpringDataJackson3Configuration.PageModule;
import org.springframework.data.web.config.SpringDataWebSettings;
import org.springframework.data.web.config.EnableSpringDataWebSupport.PageSerializationMode;

@Configuration
public class JacksonConfig {

    @Bean
    public JsonMapperBuilderCustomizer jsonCustomizer() {
        return builder -> {
            builder.addModule(new PageModule(new SpringDataWebSettings(PageSerializationMode.DIRECT)));
        };
    }
}
