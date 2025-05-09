package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.ReadingRoom;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReadingRoomRepository extends JpaRepository<ReadingRoom, Long> {
    ReadingRoom findByName(String name);
}
