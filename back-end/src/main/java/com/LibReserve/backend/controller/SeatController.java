package com.LibReserve.backend.controller;

import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.dto.RoomSeatStatusResponse;
import com.LibReserve.backend.dto.SeatResponse;
import com.LibReserve.backend.dto.SeatStatusDto;
import com.LibReserve.backend.repository.ReadingRoomRepository;
import com.LibReserve.backend.repository.SeatRepository;
import com.LibReserve.backend.service.ReservationService;
import com.LibReserve.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reading-rooms")
@RequiredArgsConstructor
public class SeatController {
    private final ReadingRoomRepository readingRoomRepository;
    private final SeatRepository seatRepository;
    private final ReservationService reservationService;
    private final SeatService seatService;

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
    public List<SeatStatusDto> getRoomSeatStatus(@PathVariable Long roomId){
        RoomSeatStatusResponse status = reservationService.getRoomSeatStaus(roomId);
        return status.getSeatStatus();
    }

    @PostMapping("/{roomId}/seats/generate")
    public ResponseEntity<Map<String, Integer>> generateSeats(
            @PathVariable Long roomId, @RequestParam int count) {
        ReadingRoom room = readingRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("해당 열람실이 존재하지 않습니다."));
        int created = seatService.createSeats(room, count);
        return ResponseEntity.ok(Map.of("created", created));
    }

}
