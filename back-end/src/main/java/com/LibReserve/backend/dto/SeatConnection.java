package com.LibReserve.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class SeatConnection {
    private Long seatId;
    private Long roomId;
    private boolean status;
}
