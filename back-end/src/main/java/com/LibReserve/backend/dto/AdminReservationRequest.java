package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.ReservationStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;


@Getter
@Setter
public class AdminReservationRequest {
    private Long userId;
    private Long seatId;
    private LocalDate date;
    private LocalDate startDate;
    private LocalTime startTime;
    private LocalDate endDate;
    private LocalTime endTime;
    private ReservationStatus status;

}
