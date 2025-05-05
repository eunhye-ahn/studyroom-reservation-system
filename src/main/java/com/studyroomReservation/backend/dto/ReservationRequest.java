package com.studyroomReservation.backend.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationRequest {
    private Long studyRoomId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public Long getStudyRoomId() {
        return studyRoomId;
    }

    public void setStudyRoomId(Long studyRoomId) {
        this.studyRoomId = studyRoomId;
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
