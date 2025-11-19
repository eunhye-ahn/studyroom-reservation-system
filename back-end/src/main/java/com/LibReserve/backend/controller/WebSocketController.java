package com.LibReserve.backend.controller;

import com.LibReserve.backend.dto.SeatStatusMessage;
import com.LibReserve.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SeatService seatService;

    @MessageMapping("/seat.updateStatus")
    @SendTo("/topic/seats")
    public SeatStatusMessage updateStatus(@Payload SeatStatusMessage message) {
        return message.withTimestamp();
    }
}
