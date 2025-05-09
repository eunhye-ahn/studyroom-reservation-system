package com.LibReserve.backend.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class RefreshToken {
    @Id
    private String email;

    private String token;

    public RefreshToken() {
    }

    public RefreshToken(String email, String token) {
        this.email = email;
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
