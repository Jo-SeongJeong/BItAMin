package com.saessakmaeul.bitamin.member.repository;

import com.saessakmaeul.bitamin.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
    int countByEmail(String email);
    int countByNickname(String nickname);
}