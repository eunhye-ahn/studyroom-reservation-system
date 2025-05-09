package com.LibReserve.backend.controller;

import com.LibReserve.backend.dto.AdminReservationRequest;
import com.LibReserve.backend.dto.ReservationResponse;
import com.LibReserve.backend.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/reservation")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminReservationController {
    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations(){
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PostMapping
    public ResponseEntity<ReservationResponse> createReservation(@RequestBody AdminReservationRequest request){
        return ResponseEntity.ok(reservationService.createReservationByAdmin(request));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id){
        reservationService.deleteReservationByAdmin(id);
        return ResponseEntity.noContent().build();
    }

}
