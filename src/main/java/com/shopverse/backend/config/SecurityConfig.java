package com.shopverse.backend.config;

import com.shopverse.backend.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> {})   // 🔥 ADD THIS LINE

                .authorizeHttpRequests(auth -> auth

                        // frontend
                        .requestMatchers(
                                "/",
                                "/**.html",
                                "/**.css",
                                "/**.js",
                                "/images/**",
                                "/uploads/**",
                                "/favicon.ico"
                        ).permitAll()
                        // auth
                        .requestMatchers("/api/auth/**").permitAll()

                        // public
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()

                        // admin
                        .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    }