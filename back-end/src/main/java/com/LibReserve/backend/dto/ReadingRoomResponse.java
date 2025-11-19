package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.CategoryType;
import com.LibReserve.backend.domain.ReadingRoom;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class ReadingRoomResponse {
    private Long id;
    private String name;
    private CategoryType categoryType;
    private int floor;
    private int totalSeats;
    private int availableSeats;

    public ReadingRoomResponse(ReadingRoom room) {
        this.id = room.getId();
        this.name = room.getName();
        this.categoryType = room.getCategoryType();
        this.floor = room.getFloor();
        this.totalSeats = room.getSeats().size();
        this.availableSeats = (int)room.getSeats().stream()
                .filter(seat -> seat.isAvailable())
                .count();
    }}
