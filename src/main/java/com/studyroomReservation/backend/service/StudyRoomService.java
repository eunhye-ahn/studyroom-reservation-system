package com.studyroomReservation.backend.service;

import com.studyroomReservation.backend.domain.StudyRoom;
import com.studyroomReservation.backend.repository.StudyRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyRoomService {
    private final StudyRoomRepository studyRoomRepository;

    public StudyRoomService(StudyRoomRepository studyRoomRepository) {
        this.studyRoomRepository = studyRoomRepository;
    }

    public List<StudyRoom> getAllRooms(){
        return studyRoomRepository.findAll();
    }
}
