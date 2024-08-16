package com.saessakmaeul.bitamin.consultation.repository;

import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Page<Consultation> findBySessionIdIsNotNullAndCurrentParticipantsBetween(int start, int end, Pageable pageable);
    Page<Consultation> findByIsPrivatedAndSessionIdIsNotNullAndCurrentParticipantsBetween(boolean isPrivated, int start, int end, Pageable pageable);
    Page<Consultation> findByCategoryAndSessionIdIsNotNullAndCurrentParticipantsBetween(String category, int start, int end, Pageable pageable);

    @Query(value = "SELECT * " +
            "FROM consultation " +
            "WHERE current_participants <= ?1 " +
            "AND is_privated = 0 " +
            "AND id NOT IN ?2 " +
            "AND start_time > now() " +
            "ORDER BY RAND() " +
            "LIMIT 1 ",
            nativeQuery = true)
    Optional<Consultation> findByCurrentParticipantsLessThanEqualOrderByRand(int currentParticipant, List<Long> consultationIds);

    @Query(value = "SELECT * " +
            "FROM consultation "+
            "WHERE category = ?1 " +
            "AND current_participants <= ?2 " +
            "AND is_privated = 0 " +
            "AND id NOT IN ?3 " +
            "AND start_time > now() " +
            "ORDER BY RAND() " +
            "LIMIT 1 ",
            nativeQuery = true)
    Optional<Consultation> findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(String category, int currentParticipant, List<Long> consultationIds);

    @Query(value = "SELECT id " +
            "FROM consultation " +
            "WHERE current_participants = 0 " +
            "AND session_id is null " +
            "AND start_time <= NOW() - INTERVAL 15 DAY ",
            nativeQuery = true)
    List<Long> findIdOfOldConsultations();

    @Query(value = "SELECT * " +
            "FROM consultation " +
            "WHERE id = ?1 " +
            "AND now() BETWEEN ?2 AND ?3 ", 
            nativeQuery = true)
    Optional<Consultation> findByIdAndCurrentTimeBetween(Long id, LocalDateTime startTime, LocalDateTime endTime);

}
