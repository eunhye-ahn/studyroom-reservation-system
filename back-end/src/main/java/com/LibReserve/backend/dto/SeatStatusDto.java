package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.Seat;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class SeatStatusDto {
    private Long seatId;
    private int seatNumber;
    private boolean available; //true 이용가능 false 예약됨

}
