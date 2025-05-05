package com.LibReserve.backend.domain;

import jakarta.persistence.*;

@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int number;

    @ManyToOne
    @JoinColumn(name = "reading_room_id")
    private ReadingRoom readingRoom;

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

    public ReadingRoom getReadingRoom() {
        return readingRoom;
    }

    public void setReadingRoom(ReadingRoom readingRoom) {
        this.readingRoom = readingRoom;
    }
}
