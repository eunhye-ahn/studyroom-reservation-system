package com.LibReserve.backend.service;

import com.LibReserve.backend.config.JwtUtil;
import com.LibReserve.backend.domain.RefreshToken;
import com.LibReserve.backend.domain.User;
import com.LibReserve.backend.dto.LoginRequest;
import com.LibReserve.backend.dto.LoginResponse;
import com.LibReserve.backend.dto.SignUpRequest;
import com.LibReserve.backend.repository.RefreshTokenRepository;
import com.LibReserve.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RefreshTokenRepository refreshTokenRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.refreshTokenRepository = refreshTokenRepository;
    }



    public LoginResponse loginAndCreateToken(LoginRequest request){
        System.out.println("🔐 로그인 요청 email: " + request.getEmail());
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new IllegalArgumentException("존재하지 않는 아이디입니다."));
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        System.out.println("✅ 비밀번호 일치");
        String accessToken = jwtUtil.generateAccessToken(user.getName(), user.getEmail(),user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getName(), user.getName(),user.getRole());

        System.out.println("accessToken: " + accessToken);

        refreshTokenRepository.save(
                new RefreshToken(user.getName(), refreshToken)
        );

        return new LoginResponse(accessToken, refreshToken);

    }


    public void signUp(SignUpRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new IllegalArgumentException("이미 사용중인 이메일입니다.");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        System.out.println("초기 role 값: " + user.getRole());  // ✅ 확인 로그
        userRepository.save(user);
    }

}
