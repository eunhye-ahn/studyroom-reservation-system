package com.LibReserve.backend.config;  // com.example.studyroom.config → me.eh.backend.config

import com.LibReserve.backend.domain.User;
import com.LibReserve.backend.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtUtil jwtUtil;


    public SecurityConfig(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;

    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, UserRepository userRepository) throws Exception {




        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ✅ 여기 추가
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/signUp","/api/auth/login").permitAll() // ✅ 로그인/회원가입 허용.requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/rooms").permitAll()
                        .requestMatchers("/reservation").authenticated()
                        .requestMatchers("/reading-rooms/**").permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")


                        .anyRequest().authenticated()
                        //나머지는 인증 필요
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtUtil,userRepository), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true); // ❗️이거 중요

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


}

