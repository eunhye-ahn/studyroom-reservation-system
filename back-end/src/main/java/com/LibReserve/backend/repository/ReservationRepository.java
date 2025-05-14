package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.Reservation;
import com.LibReserve.backend.domain.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Query("SELECT r.seat.id FROM Reservation r " +
            "WHERE r.seat.readingRoom.id = :roomId " +
            "AND r.date = :date " +
            "AND (r.startTime < :endTime AND r.endTime > :startTime)")
    List<Long> findReservedSeatIds(
            @Param("roomId") Long roomId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    //종료된 예약 찾기
    @Query("SELECT r FROM Reservation r WHERE " +
            "r.seat.available = false "+
            "AND FUNCTION('TIMESTAMP', r.date, r.endTime) <= :now")
    List<Reservation> findExpiredReservations(@Param("now") LocalDateTime now);
}
