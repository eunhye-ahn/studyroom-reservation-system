package com.LibReserve.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
public class RoomSeatStatusResponse {
    private Long roomId;
    private String roomName;
    private LocalDate date;
    private LocalTime currentTime;
    private LocalTime endTime;
    private List<SeatStatusDto> seatStatus;
}
