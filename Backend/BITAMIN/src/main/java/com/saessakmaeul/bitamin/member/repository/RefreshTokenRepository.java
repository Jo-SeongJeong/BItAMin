package com.saessakmaeul.bitamin.member.repository;

import com.saessakmaeul.bitamin.member.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByUserId(Long id);
    Optional<RefreshToken> deleteByUserId(Long id);
}