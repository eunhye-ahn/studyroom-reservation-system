package com.LibReserve.backend.event;

import com.LibReserve.backend.domain.Seat;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SeatReturnedEvent {
    private Long roomId;
    private Seat releasedSeat;
}
