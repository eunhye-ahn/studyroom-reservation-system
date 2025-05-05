package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, String> {
    RefreshToken findByEmail(String email);
    void deleteByEmail(String email);
}
