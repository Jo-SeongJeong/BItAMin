package com.saessakmaeul.bitamin.member.repository;

import com.saessakmaeul.bitamin.member.entity.HealthReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HealthReportRepository extends JpaRepository<HealthReport, Long> {
    List<HealthReport> findByMemberId(Long memberId);
    @Query("SELECT COUNT(h), MAX(h.checkupDate) FROM HealthReport h WHERE h.member.id = :memberId AND h.checkupDate BETWEEN :beforeDate AND :nowDate")
    List<Object[]> findCountAndLatestCheckupDate(@Param("memberId") Long memberId, @Param("beforeDate") LocalDate beforeDate, @Param("nowDate") LocalDate nowDate);
}
