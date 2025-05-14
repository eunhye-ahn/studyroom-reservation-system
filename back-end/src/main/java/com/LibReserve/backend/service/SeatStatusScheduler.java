package com.LibReserve.backend.service;

import com.LibReserve.backend.domain.Reservation;
import com.LibReserve.backend.domain.Seat;
import com.LibReserve.backend.repository.ReservationRepository;
import com.LibReserve.backend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatStatusScheduler {
    private final ReservationRepository reservationRepository;
    private final SeatRepository seatRepository;



    @Scheduled(fixedRate = 60*1000)
    public void updateSeatAvailablity() {

        LocalDateTime now = LocalDateTime.now();
        System.out.println("[스케줄러 실행] 현재 시각: " + now);

        List<Reservation> expired = reservationRepository.findExpiredReservations(now);
        System.out.println("⏰ 만료된 예약 수: " + expired.size());

        for (Reservation r : expired) {
            System.out.println("➡️ 반납 처리: 예약 ID = " + r.getId() +
                    ", 종료 시각 = " + r.getEndDateTime() +
                    ", 좌석 ID = " + r.getSeat().getId());

            List<Reservation> expiredReservation =
                    reservationRepository.findExpiredReservations(now);

            for (Reservation reservation : expiredReservation) {
                Seat seat = reservation.getSeat();
                seat.setAvailable(true);
                seatRepository.save(seat);
            }
        }
    }}