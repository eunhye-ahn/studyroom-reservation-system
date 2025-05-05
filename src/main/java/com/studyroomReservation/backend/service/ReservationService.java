package com.studyroomReservation.backend.service;

import com.studyroomReservation.backend.domain.Reservation;
import com.studyroomReservation.backend.domain.StudyRoom;
import com.studyroomReservation.backend.domain.User;
import com.studyroomReservation.backend.dto.ReservationRequest;
import com.studyroomReservation.backend.repository.ReservationRepository;
import com.studyroomReservation.backend.repository.StudyRoomRepository;
import com.studyroomReservation.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final StudyRoomRepository studyRoomRepository;
    private final UserRepository userRepository;

    public List<Reservation> getReservationsByEmail(String email){
        return reservationRepository.findByUserEmail(email);
    }

    public ReservationService(ReservationRepository reservationRepository,
                              StudyRoomRepository studyRoomRepository,
                              UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.studyRoomRepository = studyRoomRepository;
        this.userRepository = userRepository;
    }

    public void createReservation(String email, ReservationRequest request){
        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));
        StudyRoom room = (StudyRoom) studyRoomRepository.findById(request.getStudyRoomId())
                .orElseThrow(()-> new IllegalArgumentException("스터디룸을 찾을 수 없습니다."));

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setStudyRoom(room);
        reservation.setDate(request.getDate());
        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());

        reservationRepository.save(reservation);
    }
}
