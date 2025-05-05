package com.studyroomReservation.backend.controller;

import com.studyroomReservation.backend.domain.StudyRoom;
import com.studyroomReservation.backend.repository.StudyRoomRepository;
import com.studyroomReservation.backend.service.StudyRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/rooms")
public class StudyRoomController {
    private final StudyRoomService studyRoomService;

    public StudyRoomController(StudyRoomService studyRoomService) {
        this.studyRoomService = studyRoomService;
    }

    @GetMapping
    public ResponseEntity<List<StudyRoom>> getAllRooms(){
        List<StudyRoom> rooms = studyRoomService.getAllRooms();
        return ResponseEntity.ok(rooms);
    }
}
