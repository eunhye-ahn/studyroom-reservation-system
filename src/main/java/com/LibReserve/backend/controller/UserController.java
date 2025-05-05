package com.LibReserve.backend.controller;

import com.LibReserve.backend.config.JwtUtil;
import com.LibReserve.backend.domain.RefreshToken;
import com.LibReserve.backend.dto.LoginRequest;
import com.LibReserve.backend.dto.LoginResponse;
import com.LibReserve.backend.dto.SignUpRequest;
import com.LibReserve.backend.repository.RefreshTokenRepository;
import com.LibReserve.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserController(UserService userService, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try {
            LoginResponse token = userService.loginAndCreateToken(request);
            return ResponseEntity.ok(token);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 실패: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ","");
        String email = jwtUtil.getEmailFromToken(token);

        RefreshToken refreshToken = refreshTokenRepository.findByEmail(email);
        if(refreshToken != null) {
            refreshTokenRepository.deleteByEmail(email);
            return ResponseEntity.ok("로그아웃 성공");
        } else{
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 로그아웃되었습니다.");
        }

    }


    @PostMapping("/signUp")
    public ResponseEntity<String> signUp(@RequestBody SignUpRequest request){
        userService.signUp(request);
        return ResponseEntity.ok("회원가입 성공");
    }

    @GetMapping("/me")
    public ResponseEntity<String> getMyInfo() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok("현재 로그인한 사용자 이메일: " + email);
    }
}
