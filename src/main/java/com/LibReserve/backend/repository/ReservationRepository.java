package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.Reservation;
import com.LibReserve.backend.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUserEmail(String email);

    // 예약 중복 확인
    boolean existsBySeatAndDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Seat seat, LocalDate date, LocalTime endTime, LocalTime startTime
    );
}
