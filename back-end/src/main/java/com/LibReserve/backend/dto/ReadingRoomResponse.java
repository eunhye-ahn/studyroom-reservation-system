package com.LibReserve.backend.dto;

import com.LibReserve.backend.domain.CategoryType;
import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.domain.Subcategory;

public class ReadingRoomResponse {
    private Long id;
    private String name;
    private CategoryType category;
    private Subcategory subcategory;
    private int floor;
    private int totalSeats;
    private int availableSeats;

    public ReadingRoomResponse(ReadingRoom room) {
        this.id = room.getId();
        this.name = room.getName();
        this.category = room.getCategoryType();
        this.subcategory = room.getSubcategory();
        this.floor = room.getFloor();
        this.totalSeats = room.getSeats().size();
        this.availableSeats = (int)room.getSeats().stream()
                .filter(seat -> seat.isAvailable())
                .count();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public CategoryType getCategory() {
        return category;
    }

    public void setCategory(CategoryType category) {
        this.category = category;
    }

    public Subcategory getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(Subcategory subcategory) {
        this.subcategory = subcategory;
    }

    public int getFloor() {
        return floor;
    }

    public void setFloor(int floor) {
        this.floor = floor;
    }
}
