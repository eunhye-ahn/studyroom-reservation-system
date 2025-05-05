package com.studyroomReservation.backend.repository;

import com.studyroomReservation.backend.domain.StudyRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyRoomRepository extends JpaRepository<StudyRoom, Long> {
}
