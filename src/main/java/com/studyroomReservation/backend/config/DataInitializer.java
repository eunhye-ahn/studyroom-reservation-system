package com.studyroomReservation.backend.config;

import com.studyroomReservation.backend.domain.StudyRoom;
import com.studyroomReservation.backend.repository.StudyRoomRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    private final StudyRoomRepository studyRoomRepository;

    public DataInitializer(StudyRoomRepository studyRoomRepository) {
        this.studyRoomRepository = studyRoomRepository;
    }

    @Override
    public void run(String... args) {
        studyRoomRepository.save(new StudyRoom("A룸", 4));
        studyRoomRepository.save(new StudyRoom("B룸", 6));
    }
}
