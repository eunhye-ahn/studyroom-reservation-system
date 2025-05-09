package com.LibReserve.backend.config;


//요청의 Authorization 헤더에서 JWT 토큰 추출
//
//토큰 유효성 검증 (jwtUtil.validateToken)
//
//이메일(subject)을 꺼내서 인증 객체 생성
//
//Spring Security의 SecurityContext에 등록
//→ 이후 컨트롤러에서 인증된 사용자로 인식됨

import com.LibReserve.backend.domain.User;
import com.LibReserve.backend.dto.UserPrincipal;
import com.LibReserve.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.Authentication;


import java.io.IOException;
import java.util.List;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;


    public JwtAuthenticationFilter( JwtUtil jwtUtil, UserRepository userRepository) {

        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        System.out.println("Jwt 필터 진입: " + request.getServletPath());
        String path = request.getServletPath();
        return path.equals("/api/auth/signUp") || path.equals("/api/auth/login")
                || path.startsWith("/rooms");
    }

    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
        throws ServletException, IOException { //실제필터링작업 수행하는 메소드

        String token = getTokenFromRequest(request);

        System.out.println("토큰: " + token);

        if(token != null && jwtUtil.validateToken(token)) {
            String name = jwtUtil.getNameFromToken(token);
            String email = jwtUtil.getEmailFromToken(token);
            String role = jwtUtil.getRoleFromToken(token);

            System.out.println("토큰에서 추출한 email: " + email);

            User user = userRepository.findByEmail(email).orElseThrow(() ->

                    new RuntimeException("사용자 정보를 찾을 수 없습니다."));

            UserPrincipal userPrincipal = new UserPrincipal(user);


            //그다음에 인증 객체 생성
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities());
            authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            //SecurityContext에 인증객체 등록
            SecurityContextHolder.getContext().setAuthentication(authentication);



            Authentication auth = SecurityContextHolder.getContext().getAuthentication();




        }





        filterChain.doFilter(request, response); //다음 요청 계속 전달하기
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " 이후 토큰 부분 추출
        }
        return null;
    }

}
