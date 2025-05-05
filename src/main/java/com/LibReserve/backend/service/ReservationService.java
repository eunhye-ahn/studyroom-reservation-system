package com.LibReserve.backend.service;

import com.LibReserve.backend.domain.Reservation;
import com.LibReserve.backend.domain.Seat;
import com.LibReserve.backend.domain.User;
import com.LibReserve.backend.dto.ReservationRequest;
import com.LibReserve.backend.dto.ReservationResponse;
import com.LibReserve.backend.repository.ReservationRepository;
import com.LibReserve.backend.repository.ReadingRoomRepository;
import com.LibReserve.backend.repository.SeatRepository;
import com.LibReserve.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReadingRoomRepository readingRoomRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public List<Reservation> getReservationsByEmail(String email){
        return reservationRepository.findByUserEmail(email);
    }

    public ReservationService(ReservationRepository reservationRepository,
                              ReadingRoomRepository readingRoomRepository,
                              UserRepository userRepository,
                              SeatRepository seatRepository) {
        this.reservationRepository = reservationRepository;
        this.readingRoomRepository = readingRoomRepository;
        this.userRepository = userRepository;
        this.seatRepository = seatRepository;
    }

    public void createReservation(String email, ReservationRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(()-> new IllegalArgumentException("스터디룸을 찾을 수 없습니다."));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setSeat(seat);
        reservation.setDate(request.getDate());
        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());

        reservationRepository.save(reservation);
    }

    public List<ReservationResponse> getMyReservations(String email){
        return reservationRepository.findByUserEmail(email)
                .stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
    }
}
