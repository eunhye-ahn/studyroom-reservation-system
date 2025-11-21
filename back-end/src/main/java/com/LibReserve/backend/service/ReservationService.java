package com.LibReserve.backend.service;

import com.LibReserve.backend.domain.*;
import com.LibReserve.backend.dto.*;
import com.LibReserve.backend.repository.ReservationRepository;
import com.LibReserve.backend.repository.ReadingRoomRepository;
import com.LibReserve.backend.repository.SeatRepository;
import com.LibReserve.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final ReadingRoomRepository readingRoomRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher applicationEventPublisher;

    private final SimpMessagingTemplate messagingTemplate;

    public List<Reservation> getReservationsByEmail(String email){
        return reservationRepository.findByUserEmail(email);
    }

//    public ReservationService(ReservationRepository reservationRepository,
//                              ReadingRoomRepository readingRoomRepository,
//                              UserRepository userRepository,
//                              SeatRepository seatRepository) {
//        this.reservationRepository = reservationRepository;
//        this.readingRoomRepository = readingRoomRepository;
//        this.userRepository = userRepository;
//        this.seatRepository = seatRepository;
//    }

    @Transactional
    public ReservationResponse createReservation(String email, ReservationRequest request){

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.FORBIDDEN,"사용자 정보를 찾을 수 없습니다."));
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.FORBIDDEN,"스터디룸을 찾을 수 없습니다."));

        LocalDate date = LocalDate.now();
        LocalTime startTime = LocalTime.now().withSecond(0).withNano(0);
        LocalTime endTime = startTime.plusHours(3);
        LocalDate endDate = endTime.isBefore(startTime) ? date.plusDays(1) : date;


        //좌석 겹침
        boolean exists = reservationRepository.existsBySeatAndDateAndTimeOverlap(
                seat, date, startTime,endTime
        );
//        boolean exists = reservationRepository.existsBySeatIdAndStatus(
//                seat.getId(),
//                true
//        );
//        boolean exists = reservationRepository.existsActiveBySeatId(seat.getId());

        if(exists){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"이미 예약된 좌석입니다.");
        }

        //사용자 겹침
        boolean userTaken = reservationRepository.existsByUserAndDateAndTimeOverlap(
                user, date, startTime,endTime
        );
        if(userTaken){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"이미 진행 중인 예약이 있습니다.");
        }

        Reservation reservation = new Reservation(user,
                date, startTime, endDate, endTime,seat,0, ReservationStatus.ACTIVE);

        seat.setAvailable(false);
        seatRepository.save(seat);
        reservationRepository.save(reservation);

        applicationEventPublisher.publishEvent(
                new ReservationCreatedEvent(seat, user.getId())
        );

        return new ReservationResponse(reservation);

    }

    // 트랜잭션 커밋 후 WebSocket 전송
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendWebSocketAfterCommit(ReservationCreatedEvent event) {

        if (messagingTemplate == null) {
            return;  // 테스트 환경에서는 그냥 스킵
        }
        Seat seat = event.getSeat();

        SeatStatusMessage message = SeatStatusMessage.builder()
                .seatId(seat.getId())
                .number(seat.getNumber())
                .status(SeatStatusMessage.SeatStatus.OCCUPIED)
                .userId(event.getUserId())
                .type(SeatStatusMessage.MessageType.STATUS_CHANGE)
                .build()
                .withTimestamp();

        messagingTemplate.convertAndSend(
                "/topic/rooms/" + seat.getReadingRoom().getId() + "/seats",
                message
        );

    }

    // 트랜잭션 커밋 후 WebSocket 전송
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void sendWebSocketAfterCancel(ReservationCanceledEvent event) {

        if (messagingTemplate == null) {
            return;  // 테스트 환경에서는 그냥 스킵
        }
        Seat seat = event.getSeat();

        SeatStatusMessage message = SeatStatusMessage.builder()
                .seatId(seat.getId())
                .number(seat.getNumber())
                .status(SeatStatusMessage.SeatStatus.AVAILABLE)
                .userId(event.getUserId())
                .type(SeatStatusMessage.MessageType.STATUS_CHANGE)
                .build()
                .withTimestamp();

        messagingTemplate.convertAndSend(
                "/topic/rooms/" + seat.getReadingRoom().getId() + "/seats",
                message
        );

    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public List<ReservationResponse> getMyReservations(String email){
        return reservationRepository.findByUserEmail(email)
                .stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
    }
    @Transactional
    public void cancelReservation(Long reservationId, String email){
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.FORBIDDEN,"예약 정보를 찾을 수 없습니다."));
        if(!reservation.getUser().getEmail().equals(email)){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"본인의 예약만 취소할 수 있습니다.");
        }
        Seat seat = reservation.getSeat();
        seat.setAvailable(true);
        seatRepository.save(seat);
        reservationRepository.delete(reservation);

        applicationEventPublisher.publishEvent(
                new ReservationCanceledEvent(seat, reservation.getUser().getId())
        );
    }

    public List<ReservationResponse> getAllReservations(){
        List<Reservation> reservations = reservationRepository.findAll();
        return reservations.stream()
                .map(ReservationResponse::new)
                .collect(Collectors.toList());
    }

    public ReservationResponse createReservationByAdmin(AdminReservationRequest request){
        User user = userRepository.findById(request.getUserId())
                .orElseThrow( ()->new ResponseStatusException(HttpStatus.FORBIDDEN,"사용자 없음"));
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(()->new ResponseStatusException(HttpStatus.FORBIDDEN,"좌석 없음"));

        boolean exists = reservationRepository.existsBySeatAndDateAndTimeOverlap(
                seat, request.getDate(), request.getStartTime(), request.getEndTime()
        );

        if(exists){
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"이미 예약된 좌석입니다.");
        }

        Reservation reservation = new Reservation(user,
                request.getDate(), request.getStartTime(),request.getEndDate(), request.getEndTime(),seat, 0, ReservationStatus.ACTIVE);
        seat.setAvailable(false);
        reservationRepository.save(reservation);

        return new ReservationResponse(reservation);

    }

    public void deleteReservationByAdmin(Long id){
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.FORBIDDEN,"예약 없음"));

        reservationRepository.delete(reservation);
    }

    public RoomSeatStatusResponse getRoomSeatStaus(Long roomId){
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);
        LocalTime end = LocalTime.now().plusHours(3);

        ReadingRoom room = readingRoomRepository.findById(roomId)
                .orElseThrow(()->new ResponseStatusException(HttpStatus.FORBIDDEN,"해당 열람실이 존재하지 않습니다."));

        List<Seat> seats = seatRepository.findByReadingRoom(room);

        List<Long> reservedSeatIds = reservationRepository.findReservedSeatIds(roomId, today, now, end);

        List<SeatStatusDto> seatStatuses = seats.stream()
                .map(seat -> new SeatStatusDto(
                        seat.getId(),
                        seat.getNumber(),
                        seat.isAvailable()
                ))
                .collect(Collectors.toList());

        return new RoomSeatStatusResponse(
                roomId,
                room.getName(),
                today,
                now,
                end,
                seatStatuses
        );
    }

    public ReservationResponse extendReservation(Long reservationId, String email) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("본인만 예약을 연장할 수 있습니다."));

        if (reservation.getExtensionCount() > 3) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"하루 최대 연장 횟수(3회)를 초과했습니다.");
        }

        LocalTime now = LocalTime.now();
        if (now.isBefore(reservation.getEndTime().minusHours(1))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "예약 종료 1시간부터 연장이 가능합니다.");
        }

        LocalDate date = reservation.getDate();
        LocalTime newStart = now;
        LocalTime newEnd = now.plusHours(3);
        LocalDate newEndDate = newEnd.isBefore(newStart) ? date.plusDays(1) : date;

        boolean exists = reservationRepository.existsBySeatAndDateAndTimeOverlap(
                reservation.getSeat(), date, newStart, newEnd
        );

        if (exists) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,"이미 예약된 좌석입니다.");
        }

        Reservation newReservation = new Reservation(
                reservation.getUser(),
                date,
                newStart,
                newEndDate,
                newEnd,
                reservation.getSeat(),
                reservation.getExtensionCount()+1,
                reservation.getStatus()
                );
        reservationRepository.save(newReservation);

        return new ReservationResponse(newReservation);
    }

    public int getExtensionCount(Long reservationId, String email) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(()-> new RuntimeException("예약을 찾을 수 없습니다."));
        if(!reservation.getUser().getEmail().equals(email)){
            throw new RuntimeException("해당 예약에 접근할 수 없습니다.");
        }
        return reservation.getExtensionCount();
    }

    public void saveReservation(Reservation reservation) {
        reservationRepository.save(reservation);
    }

    public Reservation findActiveBySeatId(Long seatId){
        return reservationRepository.findBySeatIdAndStatus(seatId, ReservationStatus.ACTIVE)
                .orElse(null);
    }
}
