package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.Reservation;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class ReservationResponse {
    private Long Id;
    private String userEmail;
    private String readingRoomName;
    private int seatNumber;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private String status;

    public ReservationResponse(Reservation reservation) {
        this.Id = reservation.getId();
        this.userEmail = reservation.getUser().getEmail();
        this.readingRoomName = reservation.getSeat().getReadingRoom().getName();
        this.seatNumber = reservation.getSeat().getNumber();
        this.date = reservation.getDate();
        this.startTime = reservation.getStartTime();
        this.endTime = reservation.getEndTime();
        this.status = reservation.getStatus().toString();
    }

}
