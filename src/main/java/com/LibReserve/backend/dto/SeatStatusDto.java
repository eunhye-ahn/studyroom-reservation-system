package com.LibReserve.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SeatStatusDto {
    private Long seatId;
    private int seatNumber;
    private boolean available; //true 이용가능 false 예약됨
}
