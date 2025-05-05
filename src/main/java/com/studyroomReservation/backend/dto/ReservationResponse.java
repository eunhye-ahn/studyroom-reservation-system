package com.studyroomReservation.backend.dto;

import com.studyroomReservation.backend.domain.Reservation;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationResponse {
    private Long Id;
    private String studyRoom;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public ReservationResponse(Reservation reservation) {
        this.Id = reservation.getId();
        this.studyRoom = reservation.getStudyRoom().getName();
        this.date = reservation.getDate();
        this.startTime = reservation.getStartTime();
        this.endTime = reservation.getEndTime();
    }

    public Long getReservationId() {
        return Id;
    }

    public void setId(Long Id) {
        this.Id = Id;
    }

    public String getStudyRoom() {
        return studyRoom;
    }

    public void setStudyRoom(String studyRoom) {
        this.studyRoom = studyRoom;
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

    public void setTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
