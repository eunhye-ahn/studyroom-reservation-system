package com.LibReserve.backend.dto;

import lombok.Data;

//관리자>서버
@Data
public class AdminControlRequest {
    private String action; //강제반납 or 긴급공지
    private Long seatId;
    private String message; //강제반납일때는 null
    private String adminPassword; //관리자인증용(나중에 세션/토큰으로 교체할 예정)
}
