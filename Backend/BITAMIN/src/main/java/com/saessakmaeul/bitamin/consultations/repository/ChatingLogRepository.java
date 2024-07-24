package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.Entity.ChatingLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatingLogRepository extends JpaRepository<ChatingLog, Long> {
    List<ChatingLog> findByConsultationId(Long chatingId);
}
