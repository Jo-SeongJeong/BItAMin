package com.saessakmaeul.bitamin.member.repository;

import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserId(long id);
    Optional<RefreshToken> deleteByUserId(long id);
}