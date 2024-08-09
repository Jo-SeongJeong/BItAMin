package com.saessakmaeul.bitamin.member.repository;

import com.saessakmaeul.bitamin.member.entity.HealthReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HealthReportRepository extends JpaRepository<HealthReport, Long> {
    List<HealthReport> findByMemberId(Long memberId);
}
