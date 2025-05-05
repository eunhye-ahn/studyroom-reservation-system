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
        return ResponseEntity.ok("예약 완료되었습니다.");
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

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponse>> getMeReservations(HttpServletRequest request){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        List<ReservationResponse> response = reservationService.getMyReservations(email);
        return ResponseEntity.ok(response);
    }

}
