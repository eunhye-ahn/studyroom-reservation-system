package com.LibReserve.backend.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int number;

    private boolean available = true;

    @ManyToOne
    @JoinColumn(name = "reading_room_id")
    private ReadingRoom readingRoom;

    public boolean isAvailable() {
        return available;
    }

//    public void setAvailable(boolean available) {
//        this.available = available;
//    }

    public void setAvailable(Boolean available) {
        System.out.println("\n");
        System.out.println("=".repeat(80));
        System.out.println("🔴 Seat.setAvailable() 호출됨!");
        System.out.println("좌석 ID: " + this.id);
        System.out.println("좌석 번호: " + this.number);
        System.out.println("변경: " + this.available + " → " + available);
        System.out.println("시간: " + LocalDateTime.now());
        System.out.println("\n📍 호출 스택:");

        StackTraceElement[] stack = Thread.currentThread().getStackTrace();
        for (int i = 2; i < Math.min(15, stack.length); i++) {
            System.out.println("  " + stack[i]);
        }
        System.out.println("=".repeat(80));
        System.out.println("\n");

        this.available = available;
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

    public ReadingRoom getReadingRoom() {
        return readingRoom;
    }

    public void setReadingRoom(ReadingRoom readingRoom) {
        this.readingRoom = readingRoom;
    }
}
