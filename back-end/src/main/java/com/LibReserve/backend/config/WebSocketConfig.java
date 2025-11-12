package com.LibReserve.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic"); //서버>클라이언트
        registry.setApplicationDestinationPrefixes("/app"); //클라이언트>서버
    }

    //웹소켓 연결을 위한 엔드포인트 등록
    //sockJS는 웹소켓 지원안하는 구버전 브라우저를 위한 폴백 옵션
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")// 프론트 연결 URL
                .setAllowedOrigins("http://localhost:5173")   // 개발 중 CORS 허용
                .withSockJS();
    }

}
