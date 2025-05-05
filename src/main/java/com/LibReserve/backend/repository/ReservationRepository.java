package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.Reservation;
import com.LibReserve.backend.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation,Long> {
    List<Reservation> findByUserEmail(String email);

    // 예약 중복 확인
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Reservation r " +
            "WHERE r.seat = :seat AND r.date = :date " +
            "AND (r.startTime < :endTime AND r.endTime > :startTime)")
    boolean existsBySeatAndDateAndTimeOverlap(
            @Param("seat") Seat seat,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );
}
