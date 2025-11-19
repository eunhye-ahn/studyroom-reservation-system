package com.LibReserve.backend.controller;

import com.LibReserve.backend.config.JwtUtil;
import com.LibReserve.backend.domain.RefreshToken;
import com.LibReserve.backend.domain.User;
import com.LibReserve.backend.dto.LoginRequest;
import com.LibReserve.backend.dto.LoginResponse;
import com.LibReserve.backend.dto.SignUpRequest;
import com.LibReserve.backend.dto.UserPrincipal;
import com.LibReserve.backend.repository.RefreshTokenRepository;
import com.LibReserve.backend.repository.UserRepository;
import com.LibReserve.backend.service.UserService;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public UserController(UserService userService, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository, UserRepository userRepository) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request){
        try {
            Optional<User> user = userRepository.findByEmail(request.getEmail());
            System.out.println("DB에서 읽어온 유저 role: " + user.get().getRole());

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
    public ResponseEntity<Map<String, Object>> getMyInfo(@AuthenticationPrincipal UserPrincipal user) {
        Map<String, Object> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        response.put("role", user.getRole());
        response.put("id", user.getId());
        return ResponseEntity.ok(response);
    }
}
