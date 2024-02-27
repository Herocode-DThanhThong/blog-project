package com.blogroot.blogroot.config;

import com.blogroot.blogroot.filter.JwtAuthenticationFilter;
import com.blogroot.blogroot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final AuthenticationHandler authenticationHandler;
    private static final String[] ALLOW_ORIGIN_LIST = {
            "http://localhost:4200"
    };

    private static final String[] ALLOW_HEADER_LIST = {
            "authorization", "content-type", "x-auth-token"
    };
    private static final String[] EXPOSE_HEADER_LIST = {
            "x-auth-token"
    };
    private static final String[] WHITE_LIST_URL = {
            "/error",
            "/api/v1/auth/**",
            "/api/v1/roles/**",
            "/v2/api-docs",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/webjars/**",
            "/v3/api-docs/**",
            "/swagger-ui/**"
    };
    private final UserRepository userRepository;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository
                .findByUsername(username)
                .orElseThrow();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
                    @Override
                    public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                        CorsConfiguration config = new CorsConfiguration();
                        config.setAllowedOrigins(Arrays.asList(ALLOW_ORIGIN_LIST));
                        config.setAllowedMethods(Arrays.asList(
                                HttpMethod.GET.name(),
                                HttpMethod.POST.name(),
                                HttpMethod.PUT.name(),
                                HttpMethod.PATCH.name(),
                                HttpMethod.DELETE.name()
                        ));
                        config.setAllowedHeaders(Arrays.asList(ALLOW_HEADER_LIST));
                        config.setExposedHeaders(Arrays.asList(EXPOSE_HEADER_LIST));
                        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                        source.registerCorsConfiguration("/**", config);
                        httpSecurityCorsConfigurer.configurationSource(source);
                    }
                })
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(req -> req
                        .requestMatchers(WHITE_LIST_URL).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(httpSecurityExceptionHandlingConfigurer -> {
                    httpSecurityExceptionHandlingConfigurer.authenticationEntryPoint(authenticationHandler);
                })
        ;
        return http.build();
    }
}
