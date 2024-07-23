package com.saessakmaeul.bitamin.consultations.repository;

import com.saessakmaeul.bitamin.consultations.Entity.Participant;
import com.saessakmaeul.bitamin.consultations.dto.response.ParticipantResponse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByConsultationId(Long consultationId);
}
