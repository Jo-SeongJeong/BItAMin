package com.saessakmaeul.bitamin.consultation.repository;

import com.saessakmaeul.bitamin.consultation.Entity.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByConsultationId(Long consultationId);
    Optional<Participant> findByMemberIdAndConsultationId(Long memberId, Long consultationId);
}
