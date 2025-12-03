package com.LibReserve.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Setter
@AllArgsConstructor
@Builder
public class SeatStatusMessage {
    private Long seatId;
    private Long roomId;
    private int number;
    private SeatStatus status;
    private Long userId;
    private LocalDateTime timestamp;
    private MessageType type;
    private String message;


    public enum SeatStatus {
        AVAILABLE,      // 이용 가능
        OCCUPIED,       // 이용 중
        RESERVED,       // 예약됨
        OUT_OF_SERVICE  // 사용 불가
    }

    public enum MessageType {
        STATUS_CHANGE,  // 좌석 상태 변경
        HEARTBEAT,      // 연결 확인용
        INITIAL_LOAD    // 초기 로드
    }

    public SeatStatusMessage(Long seatId, Long roomId, SeatStatus status, String message){
        this.seatId = seatId;
        this.roomId = roomId;
        this.status = status;
        this.message = message;
    }

    public SeatStatusMessage withTimestamp() {
        return new SeatStatusMessage(
                this.seatId,
                this.roomId,
                this.number,
                this.status,
                this.userId,
                LocalDateTime.now(),
                this.type,
                this.message
        );

    }

    @Override
    public String toString() {
        return "SeatStatusMessage{" +
                "seatId=" + seatId +
                ", seatNumber='" + number + '\'' +
                ", status=" + status +
                ", userId='" + userId + '\'' +
                ", timestamp=" + timestamp +
                ", type=" + type +
                '}';
    }
}
