package com.dental_clinic.auth_service.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final long EXPIRATION_TIME = 2; // Token hết hạn trong 2 ngày
    public void saveToken(String token, String email) {
        redisTemplate.opsForValue().set(token,email,EXPIRATION_TIME, TimeUnit.DAYS);
    }

    public String getEmailFromToken(String token){
        return (String) redisTemplate.opsForValue().get(token);
    }

    public void deleteToken(String token) {
        redisTemplate.delete(token);
    }
}
