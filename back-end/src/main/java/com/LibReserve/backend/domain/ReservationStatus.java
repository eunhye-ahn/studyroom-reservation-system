package com.LibReserve.backend.domain;

public enum ReservationStatus {
    PENDING, //예약대기
    CONFIRMED, //예약확정
    IN_USE, //사용중
    COMPLETED, //취소됨
    CANCELLED
}
