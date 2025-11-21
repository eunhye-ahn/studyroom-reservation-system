package com.LibReserve.backend.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReservationCanceledEvent {
    private final Seat seat;
    private final Long userId;
}
