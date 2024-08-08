package com.saessakmaeul.bitamin.mission.repository;

import com.saessakmaeul.bitamin.mission.entity.Phrase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhraseRepository extends JpaRepository<Phrase, Long> {
}
