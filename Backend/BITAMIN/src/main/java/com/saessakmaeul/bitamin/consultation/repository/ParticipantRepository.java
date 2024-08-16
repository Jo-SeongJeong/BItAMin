package com.saessakmaeul.bitamin.consultation.repository;

import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import com.saessakmaeul.bitamin.consultation.Entity.Participant;
import com.saessakmaeul.bitamin.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ParticipantRepository extends JpaRepository<Participant, Long> {
    List<Participant> findByConsultationId(Consultation consultationId);
    Optional<Participant> findByMemberIdAndConsultationId(Member memberId, Consultation consultationId);
    List<Participant> findByMemberId(Member memberId);
    List<Participant> findByConsultationIdInAndMemberIdNotIn(List<Consultation> consultationIdList, List<Member> memberIdList);
    Optional<Participant> findByMemberIdAndConsultationDate(Member memberId, LocalDate today);
}
