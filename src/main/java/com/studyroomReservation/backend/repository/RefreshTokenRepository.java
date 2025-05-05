package com.studyroomReservation.backend.repository;

import com.studyroomReservation.backend.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    RefreshToken findByEmail(String email);
    void deleteByEmail(String email);
}
