package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.domain.ParticipantDomain;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<ParticipantDomain, Long> {
}
