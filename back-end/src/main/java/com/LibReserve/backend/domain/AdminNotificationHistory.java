package com.LibReserve.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class AdminNotificationHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String message;
    private Long seatId;
    private Long userId;
    private boolean isRead;
    private LocalDateTime createdAt;

    public AdminNotificationHistory(String type, String message, Long seatId, Long userId) {
        this.type = type;
        this.message = message;
        this.seatId = seatId;
        this.userId = userId;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }
}
