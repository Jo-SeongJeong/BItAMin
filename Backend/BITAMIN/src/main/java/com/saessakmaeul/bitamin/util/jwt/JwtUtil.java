package com.saessakmaeul.bitamin.util.jwt;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.security.Key;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration.access}")
    private long accessTokenExpiration;

    @Getter
    @Value("${jwt.expiration.refresh}")
    private long refreshTokenExpiration;

    private Key key;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateAccessToken(Member member) {
        return generateAccessTokenWithFullInfo(member, accessTokenExpiration);
    }

    public String generateRefreshToken(Member member) {
        return generateRefreshTokenWithMinimalInfo(member.getEmail(), refreshTokenExpiration);
    }

    private String generateAccessTokenWithFullInfo(Member member, long expiration) {
        return Jwts.builder()
                .setSubject(member.getEmail())
                .claim("id", member.getId())
                .claim("nickname", member.getNickname())
                .claim("role", member.getRole())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    private String generateRefreshTokenWithMinimalInfo(String email, long expiration) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact();
    }

    public boolean isTokenExpired(String token) {
        try {
            extractExpiration(token);
            return false;
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    public void invalidateRefreshTokenByUserId(Long userId) {
        RefreshToken token = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("리프레시 토큰을 찾을 수 없습니다."));
        token.setExpireDate(LocalDateTime.now(ZoneId.systemDefault()));
        refreshTokenRepository.save(token);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT 토큰이 만료되었습니다.", e);
        } catch (UnsupportedJwtException e) {
            throw new RuntimeException("지원되지 않는 JWT 토큰입니다.", e);
        } catch (MalformedJwtException e) {
            throw new RuntimeException("JWT 토큰이 잘못되었습니다.", e);
        } catch (SignatureException e) {
            throw new RuntimeException("JWT 서명 검증에 실패했습니다.", e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("JWT 토큰이 비어있습니다.", e);
        }
    }

//    public String extractUsername(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("id", Long.class));
    }

    public String extractNickname(String token) {
        return extractClaim(token, claims -> claims.get("nickname", String.class));
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject); // 이메일 추출 메서드
    }
}
