package com.blogroot.blogroot.service;

import com.blogroot.blogroot.response.RoleManagerRequestListResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleManagerRequestRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${caching.entity.roleManagerRequest}")
    private String keyNameCache;

    private String getKeyFrom(int page, int limit, String sort) {
        return String.format(keyNameCache + ":%d%d%s", page, limit, sort);
    }

    public void clearCache() {
        Set<String> keys = redisTemplate.keys(keyNameCache + "*");
        if (keys != null) {
            for (String key : keys) {
                redisTemplate.delete(key);
            }
        }
        // redisTemplate.getConnectionFactory().getConnection().serverCommands().flushAll();
    }

    public RoleManagerRequestListResponse getRoleManagerRequestListResponse(int page, int limit, String sort) throws JsonProcessingException {
        String key = this.getKeyFrom(page, limit, sort);
        String json = (String) redisTemplate.opsForValue().get(key);
        RoleManagerRequestListResponse response = json != null
                ? objectMapper.readValue(json, new TypeReference<RoleManagerRequestListResponse>() {
        })
                : null;
        return response;
    }

    public void saveRoleManagerRequestListResponse(RoleManagerRequestListResponse roleManagerRequestListResponse,
                                                   int page, int limit, String sort) throws JsonProcessingException {
        String key = this.getKeyFrom(page, limit, sort);
        String json = objectMapper.writeValueAsString(roleManagerRequestListResponse);
        redisTemplate.opsForValue().set(key, json);
    }

}
