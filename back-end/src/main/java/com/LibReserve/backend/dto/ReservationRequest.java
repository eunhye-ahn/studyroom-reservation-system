package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.ReadingRoom;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ReservationRequest {
    private Long roomId;
    private Long seatId;
}
