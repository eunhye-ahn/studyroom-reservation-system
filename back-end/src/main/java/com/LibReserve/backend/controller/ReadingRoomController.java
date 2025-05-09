package com.LibReserve.backend.controller;

import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.dto.ReadingRoomResponse;
import com.LibReserve.backend.service.ReadingRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class ReadingRoomController {
    private final ReadingRoomService readingRoomService;

    public ReadingRoomController(ReadingRoomService readingRoomService) {
        this.readingRoomService = readingRoomService;
    }

    @GetMapping
    public List<ReadingRoomResponse> getAllRooms(){

        List<ReadingRoom> rooms = readingRoomService.getAllRooms();
        return rooms.stream().map(ReadingRoomResponse::new).toList();
    }
}
