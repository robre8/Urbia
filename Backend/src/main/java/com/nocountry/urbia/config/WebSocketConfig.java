package com.nocountry.urbia.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") //endpoint de conexion
                .setAllowedOrigins("*") // Ajustar segun frontend asi es para aceptar cualquier origen
                .withSockJS(); //para navegadores antiguos o sin websockets nativos
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app"); //prefijo de envio de datos del cliente
        registry.enableSimpleBroker("/topic"); //enviados a topic
    }
}

