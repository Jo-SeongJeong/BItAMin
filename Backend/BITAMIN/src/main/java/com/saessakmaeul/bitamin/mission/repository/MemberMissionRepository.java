package com.saessakmaeul.bitamin.mission.repository;

import com.saessakmaeul.bitamin.mission.entity.MemberMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface MemberMissionRepository extends JpaRepository<MemberMission, Long> {
    Optional<MemberMission> findFirstByUserIdOrderByCompleteDateDesc(Long memberId);

    Optional<MemberMission> findByUserIdAndCompleteDate(Long memberId, LocalDate date);
}
