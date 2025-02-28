package com.nocountry.urbia.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/reportes")  // Cliente envía datos aquí /app/reportes
    @SendTo("/topic/reportes")  // Los clientes suscritos a "/topic/reportes" recibirán el mensaje
    public String enviarNotificacion(String mensaje) {
        return mensaje;  // Se envía a todos los suscriptores
    }

    public void notificarNuevoReporte(String mensaje) {
        messagingTemplate.convertAndSend("/topic/reportes", mensaje);
        //Esto permite enviar notificaciones desde cualquier parte del backend
    }
}
