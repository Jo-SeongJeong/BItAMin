package com.saessakmaeul.bitamin.consultation.repository;

import com.saessakmaeul.bitamin.consultation.Entity.ChattingLog;
import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChattingLogRepository extends JpaRepository<ChattingLog, Long> {
    List<ChattingLog> findByConsultationId(Consultation consultationId);
}
