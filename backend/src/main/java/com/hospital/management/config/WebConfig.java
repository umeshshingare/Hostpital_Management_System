package com.hospital.management.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${app.cors.allowed-origin-patterns:}")
    private String allowedOriginPatterns;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        var mapping = registry.addMapping("/api/**")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .maxAge(3600);

        if (allowedOrigins != null && !allowedOrigins.isBlank()) {
            mapping.allowedOrigins(allowedOrigins.split(","));
        }
        if (allowedOriginPatterns != null && !allowedOriginPatterns.isBlank()) {
            mapping.allowedOriginPatterns(allowedOriginPatterns.split(","));
        }
    }
}
