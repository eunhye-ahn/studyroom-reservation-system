package com.LibReserve.backend.config;

//jwt 가 어떻게 움직일지랑 어떻게 동작할지 메소드 만들기

import com.LibReserve.backend.domain.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {
    private final String SECRET_KEY = "my-super-secret-key-that-is-very-long-256-bits!";; //보안상 환경변수로 관리
    private final long EXPIRATION_MS = 1000 * 60 * 60; //유효시간 1시간

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    //토큰 만들기
    public String generateAccessToken(String name, String email, Role role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + EXPIRATION_MS);

        //jwt 구조
        return Jwts.builder()
                .setSubject(email)
                .claim("email",email)
                .claim("role",role.name())//주체설정
                .claim("name",name)
                .setIssuedAt(now) //만든시간
                .setExpiration(expiryDate) //만료시간
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) //비밀키설정
                .compact(); //email,유효시간,비밀키 : 토큰구조
    }

    private final long REFRESH_EXPIRATION_MS = 1000 * 60 * 60 * 24 * 7;

    public String generateRefreshToken(String name, String email, Role role) {
        Date now = new Date();
        Date ExpiryDate = new Date(now.getTime() + REFRESH_EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(email)
                .claim("role",role.name())
                .claim("name",name)
                .setIssuedAt(now)
                .setExpiration(ExpiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getNameFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.get("name", String.class);
    }

    //토큰의 이메일 꺼내기
    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder() //파싱할 객체생성
                .setSigningKey(getSigningKey())//비밀키 가져오기
                .build() //파서 생성
                .parseClaimsJws(token) //토큰 검증(비밀키 일치 확인, 유효성검증 등) + 파싱
                .getBody(); //claims(정보 부분 map 구조) 만 꺼내기
        return claims.getSubject(); //이 토큰 주체(subject) 가져오기
    }



    //토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token); //토큰검증
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String getRoleFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }
}