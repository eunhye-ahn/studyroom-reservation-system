package com.LibReserve.backend.domain;

public enum ReservationStatus {
    ACTIVE,     //사용중
    CANCELLED,  //사용자 취소
    COMPLETED,  //시간 만료
    FORCE_RETURN,   //강제반납
}
