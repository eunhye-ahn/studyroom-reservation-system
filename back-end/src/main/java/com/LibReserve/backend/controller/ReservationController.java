package com.LibReserve.backend.controller;

import com.LibReserve.backend.config.JwtUtil;
import com.LibReserve.backend.domain.Reservation;
import com.LibReserve.backend.dto.ReservationRequest;
import com.LibReserve.backend.dto.ReservationResponse;
import com.LibReserve.backend.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservation")
public class ReservationController {
    private final ReservationService reservationService;
    private final JwtUtil jwtUtil;

    public ReservationController(ReservationService reservationService, JwtUtil jwtUtil){
        this.reservationService = reservationService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<String> create(@RequestBody ReservationRequest request,
                                         HttpServletRequest httpRequest){
        String token = getTokenFromRequest(httpRequest);
        String email = jwtUtil.getEmailFromToken(token);

        reservationService.createReservation(email, request);
        return ResponseEntity.ok("예약 생성 완료 : "+ request);
    }

    @GetMapping
    public ResponseEntity<List<Reservation>> getReservations(HttpServletRequest request){
        String token = getTokenFromRequest(request);
        String email = jwtUtil.getEmailFromToken(token);

        List<Reservation> reservations = reservationService.getReservationsByEmail(email);
        return ResponseEntity.ok(reservations);
    }

    public String getTokenFromRequest(HttpServletRequest request){
        String bearer = request.getHeader("Authorization");
        if(StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")){
            return bearer.substring(7);
        }
        return null;
    }

    //내 예약내역 조회
    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMeReservations(HttpServletRequest request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ReservationResponse> response = reservationService.getMyReservations(email);
        return ResponseEntity.ok(response);
    }

    //예약 취소
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long reservationId,
                                                    HttpServletRequest httpRequest) {
        String token = getTokenFromRequest(httpRequest);
        String email = jwtUtil.getEmailFromToken(token);

        reservationService.cancelReservation(reservationId, email);
        return ResponseEntity.ok("예약이 취소되었습니다.");
    }

    //예약연장
    @PostMapping("/{reservaionId}/extend")
    public ResponseEntity<ReservationResponse> extendReservation(@PathVariable Long reservaionId,
                                                    HttpServletRequest httpRequest) {
        String token = getTokenFromRequest(httpRequest);
        String email = jwtUtil.getEmailFromToken(token);

        ReservationResponse response = reservationService.extendReservation(reservaionId, email);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{reservationId}/extend")
    public ResponseEntity<Integer> getExtensionCount(@PathVariable Long reservationId,
                                                     HttpServletRequest httpRequest) {
        String token = getTokenFromRequest(httpRequest);
        String email = jwtUtil.getEmailFromToken(token);

        int extensionCount = reservationService.getExtensionCount(reservationId, email);
        return ResponseEntity.ok(extensionCount);
                                                    }

}
