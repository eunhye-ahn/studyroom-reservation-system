package com.LibReserve.backend.controller;

import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.dto.RoomSeatStatusResponse;
import com.LibReserve.backend.dto.SeatResponse;
import com.LibReserve.backend.repository.ReadingRoomRepository;
import com.LibReserve.backend.repository.SeatRepository;
import com.LibReserve.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reading-rooms")
@RequiredArgsConstructor
public class SeatController {
    private final ReadingRoomRepository readingRoomRepository;
    private final SeatRepository seatRepository;
    private final ReservationService reservationService;

    @GetMapping("/{roomId}/seats")
    public ResponseEntity<List<SeatResponse>> getSeatsByReadingRoom(@PathVariable Long roomId) {
        ReadingRoom room = readingRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("해당 열람실이 존재하지 않습니다."));

        List<SeatResponse> seats = seatRepository.findByReadingRoom(room).stream()
                .map(SeatResponse::new)
                .toList();
        return ResponseEntity.ok(seats);
    }
    @GetMapping("/{roomId}/status")
    public ResponseEntity<RoomSeatStatusResponse> getRoomSeatStatus(@PathVariable Long roomId){
        RoomSeatStatusResponse status = reservationService.getRoomSeatStaus(roomId);
        return ResponseEntity.ok(status);
    }
}
