package com.LibReserve.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@RequiredArgsConstructor
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "seat_id" , nullable = false)
    private Seat seat;

    @Column(nullable = false)
    private int extensionCount = 0;

    @Column(name = "end_date", nullable = false)
    public LocalDate getEndDate() {
        return endDate;
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ReservationStatus status = ReservationStatus.ACTIVE;


    public LocalDateTime getEndDateTime() {
        if (endDate == null) {
            throw new IllegalStateException("endDate가 설정되지 않았습니다.");
        }
        return LocalDateTime.of(this.endDate, this.endTime);
    }


    public Reservation(User user, LocalDate date, LocalTime startTime,LocalDate endDate, LocalTime endTime, Seat seat, int extensionCount, ReservationStatus status) {
        this.user = user;
        this.date = date;
        this.startTime = startTime;
        this.endDate = endDate;
        this.endTime = endTime;
        this.seat = seat;
        this.extensionCount = extensionCount;
        this.status = status;
    }
}
