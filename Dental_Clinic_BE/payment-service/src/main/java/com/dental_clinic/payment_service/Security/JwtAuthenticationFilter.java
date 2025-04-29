package com.dental_clinic.payment_service.Security;

import com.dental_clinic.payment_service.Security.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@WebFilter("/*")
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    // Constructor Injection của JwtTokenProvider
    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy token từ header "Authorization"
        String token = jwtTokenProvider.resolveToken(request);

        // Nếu token tồn tại và hợp lệ
        if (token != null && jwtTokenProvider.validateToken(token)) {
            // Lấy email từ token
            String email = jwtTokenProvider.getEmail(token);
            String role = jwtTokenProvider.getRole(token);

            // Nếu email hợp lệ (không null hoặc trống)
            if (email != null) {
                GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                // Tạo đối tượng Authentication với thông tin từ token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, Collections.singleton(authority));

                // Cung cấp chi tiết về yêu cầu (có thể là quyền hạn, vai trò nếu cần)
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Đặt đối tượng Authentication vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // Tiếp tục xử lý chuỗi filter (cho các bộ lọc khác trong Spring Security)
        filterChain.doFilter(request, response);
    }
}
