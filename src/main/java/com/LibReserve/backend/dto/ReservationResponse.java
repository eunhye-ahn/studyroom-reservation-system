package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.Reservation;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationResponse {
    private Long Id;
    private String userEmail;
    private String readingRoomName;
    private int seatNumber;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public ReservationResponse(Reservation reservation) {
        this.Id = reservation.getId();
        this.userEmail = reservation.getUser().getEmail();
        this.readingRoomName = reservation.getSeat().getReadingRoom().getName();
        this.seatNumber = reservation.getSeat().getNumber();
        this.date = reservation.getDate();
        this.startTime = reservation.getStartTime();
        this.endTime = reservation.getEndTime();
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getReadingRoomName() {
        return readingRoomName;
    }

    public void setReadingRoomName(String readingRoomName) {
        this.readingRoomName = readingRoomName;
    }

    public int getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(int seatNumber) {
        this.seatNumber = seatNumber;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
