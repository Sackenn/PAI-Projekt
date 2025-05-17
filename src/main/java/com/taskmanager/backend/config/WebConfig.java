package com.taskmanager.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With");
    }

    @Override
    public void addFormatters(FormatterRegistry registry) {
        // Dodaj niestandardowy konwerter z String na Long
        registry.addConverter(new StringToLongConverter());
    }

    // Niestandardowy konwerter z String na Long
    private static class StringToLongConverter implements Converter<String, Long> {
        @Override
        public Long convert(String source) {
            if (source == null || source.isEmpty()) {
                return null;
            }
            try {
                return Long.parseLong(source);
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }
}
