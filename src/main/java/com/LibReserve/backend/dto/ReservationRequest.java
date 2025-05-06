package com.LibReserve.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationRequest {
    private Long seatId;


    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

}
