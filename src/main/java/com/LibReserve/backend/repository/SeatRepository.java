package com.LibReserve.backend.repository;


import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByReadingRoom(ReadingRoom readingRoom);
}
