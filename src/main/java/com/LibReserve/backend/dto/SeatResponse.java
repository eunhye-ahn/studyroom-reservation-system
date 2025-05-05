package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.Seat;

public class SeatResponse {
    private Long id;
    private int number;
    private String readingRoomName;

    public SeatResponse(Seat seat) {
        this.id = seat.getId();
        this.number = seat.getNumber();
        this.readingRoomName = seat.getReadingRoom().getName();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public String getReadingRoomName() {
        return readingRoomName;
    }

    public void setReadingRoomName(String readingRoomName) {
        this.readingRoomName = readingRoomName;
    }
}
