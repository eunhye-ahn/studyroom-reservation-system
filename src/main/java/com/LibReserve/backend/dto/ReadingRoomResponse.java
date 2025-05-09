package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.ReadingRoom;

public class ReadingRoomResponse {
    private String name;
    private int totalSeats;
    private int availableSeats;

    public ReadingRoomResponse(ReadingRoom room) {

        this.name = room.getName();
        this.totalSeats = room.getSeats().size();
        this.availableSeats = (int)room.getSeats().stream()
                .filter(seat -> seat.isAvailable())
                .count();
    }



    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}
