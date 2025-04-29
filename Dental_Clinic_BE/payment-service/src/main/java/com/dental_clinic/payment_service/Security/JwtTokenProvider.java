package com.dental_clinic.payment_service.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    private final String JWT_SECRET = "your_secret_key_for_JWT_your_secret_key_for_JWT";
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    private final long JWT_EXP = 86400000L;

    // Giải mã và kiểm tra token
    public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);  // Lấy token từ header
        }
        return null;
    }

    // Kiểm tra tính hợp lệ của token
    public boolean validateToken(String token) {
        try {
            String email = getEmail(token);
            String redisToken = (String) redisTemplate.opsForValue().get("TOKEN_" + email);
            if (redisToken == null || !redisToken.equals(token)) {
                return false; // Token không hợp lệ hoặc đã bị logout
            }

            Jwts.parserBuilder().setSigningKey(JWT_SECRET.getBytes()).build().parseClaimsJws(token);  // Dùng khóa bí mật cố định để xác thực token
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;  // Nếu token không hợp lệ hoặc hết hạn
        }
    }

    // Lấy tên người dùng từ token
    public String getEmail(String token) {
        return Jwts.parserBuilder().setSigningKey(JWT_SECRET.getBytes()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String getRole(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(JWT_SECRET.getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.get("role", String.class);
    }

    public void logout(String email) {
        redisTemplate.delete("TOKEN_" + email);
    }
}
