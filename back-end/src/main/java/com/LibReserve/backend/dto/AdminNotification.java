package com.LibReserve.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

//서버>클라이언트
@Data
@AllArgsConstructor
public class AdminNotification {
    private String type; //메시지 타입
    private String message; //메시지 내용
    private Long seatId; //긴급공지면 null

}