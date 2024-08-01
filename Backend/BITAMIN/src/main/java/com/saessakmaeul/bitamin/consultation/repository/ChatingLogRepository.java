package com.saessakmaeul.bitamin.consultation.repository;

import com.saessakmaeul.bitamin.consultation.Entity.ChatingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatingLogRepository extends JpaRepository<ChatingLog, Long> {
    List<ChatingLog> findByConsultationId(Long chatingId);
}
