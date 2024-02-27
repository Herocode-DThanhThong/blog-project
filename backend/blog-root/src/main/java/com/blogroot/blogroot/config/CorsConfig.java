package com.blogroot.blogroot.config;

import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class CorsConfig {
//    private static final String[] ALLOW_URLS = {
//            "http://localhost:4200"
//    };
//
//    public void setAllowedMethods(List<String> asList) {
//    }

//    @Bean
//    public WebMvcConfigurer corsConfig() {
//        return new WebMvcConfigurer() {
//            @Override
//            public void addCorsMappings(CorsRegistry registry) {
//                registry.addMapping("/**")
//                        .allowedOrigins(ALLOW_URLS)
//                        .allowedMethods(HttpMethod.GET.name(),
//                                HttpMethod.POST.name(),
//                                HttpMethod.PUT.name(),
//                                HttpMethod.PATCH.name(),
//                                HttpMethod.DELETE.name()
//                        )
//                        .allowedHeaders(
//                                HttpHeaders.CONTENT_TYPE,
//                                HttpHeaders.AUTHORIZATION
//                        )
//                ;
//
//                WebMvcConfigurer.super.addCorsMappings(registry);
//            }
//        };
//    }
}
