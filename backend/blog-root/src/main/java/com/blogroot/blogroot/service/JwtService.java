package com.blogroot.blogroot.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Slf4j
public class JwtService {
    @Value("${application.security.jwt.secret-key}")
    private String secretKey;
    @Value("${application.security.jwt.expiration.accessToken}")
    private Long accessTokenExpiration;
    @Value("${application.security.jwt.expiration.refreshToken}")
    private Long refreshTokenExpiration;
    @Value("${application.security.jwt.expiration.verificationToken}")
    private Long verificationTokenExpiration;

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public List<String> extractAuthorities(String token) {
        return extractClaim(token, Claims -> Claims.get("authorities", List.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    public String generateAccessToken(
            UserDetails userDetails
    ) {
        Map<String, Object> extraClaims = new HashMap<String, Object>();
        extraClaims.put("authorities", userDetails.getAuthorities()
                .stream()
                .map((authority) -> authority.getAuthority())
                .collect(Collectors.toList()));
        return buildToken(extraClaims, userDetails, accessTokenExpiration);
    }

    public String generateRefreshToken(
            UserDetails userDetails
    ) {
        Map<String, Object> extraClaims = new HashMap<String, Object>();
        extraClaims.put("authorities", userDetails.getAuthorities()
                .stream()
                .map((authority) -> authority.getAuthority())
                .collect(Collectors.toList()));
        return buildToken(extraClaims, userDetails, refreshTokenExpiration);
    }

    public String generateVerificationToken(
            UserDetails userDetails
    ) {
        return buildToken(new HashMap<>(), userDetails, verificationTokenExpiration);
    }

    public String buildToken(Map<String, Object> extraClaims,
                             UserDetails userDetails,
                             Long expiration
    ) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }
}
