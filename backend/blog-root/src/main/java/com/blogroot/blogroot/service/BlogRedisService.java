package com.blogroot.blogroot.service;

import com.blogroot.blogroot.response.BlogListResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class BlogRedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    @Value("${caching.entity.blog}")
    private String keyNameCache;

    private String getKeyFrom(int page, int limit, String sort, String searchText) {
        return String.format(keyNameCache + ":%d%d%s%s", page, limit, sort, searchText);
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

    public BlogListResponse getBlogListResponse(int page, int limit, String sort, String searchText) throws JsonProcessingException {
        String key = this.getKeyFrom(page, limit, sort, searchText);
        String json = (String) redisTemplate.opsForValue().get(key);
        BlogListResponse blogListResponse = json != null ? objectMapper.readValue(json, new TypeReference<BlogListResponse>() {
        }) : null;
        return blogListResponse;
    }

    public void saveBlogListResponse(BlogListResponse blogListResponse, int page, int limit, String sort, String searchText) throws JsonProcessingException {
        String key = this.getKeyFrom(page, limit, sort, searchText);
        String json = objectMapper.writeValueAsString(blogListResponse);
        redisTemplate.opsForValue().set(key, json);
    }

}
