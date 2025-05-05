package com.LibReserve.backend.config;  // com.example.studyroom.config → me.eh.backend.config

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtUtil jwtUtil;

    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/signUp","api/auth/login").permitAll() // ✅ 로그인/회원가입 허용
                        .requestMatchers("/api/auth/logout").authenticated()
                        .requestMatchers("/rooms/**").permitAll()
                        .requestMatchers("/reservation").authenticated()
                        .requestMatchers("/reading-rooms/**").permitAll()
                        .anyRequest().authenticated()         //나머지는 인증 필요
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}