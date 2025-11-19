package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.Seat;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReservationCreatedEvent {
    private final Seat seat;
    private final Long userId;
}