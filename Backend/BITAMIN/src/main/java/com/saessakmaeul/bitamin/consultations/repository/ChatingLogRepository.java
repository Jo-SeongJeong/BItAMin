package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.domain.ChatingLogDomain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatingLogRepository extends JpaRepository<ChatingLogDomain, Long> {
}
