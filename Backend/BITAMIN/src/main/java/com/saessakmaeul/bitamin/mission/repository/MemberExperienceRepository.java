package com.saessakmaeul.bitamin.mission.repository;

import com.saessakmaeul.bitamin.mission.entity.UserExperience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberExperienceRepository extends JpaRepository<UserExperience, Long> {
}
