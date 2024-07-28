package com.saessakmaeul.bitamin.complaint.repository;

import com.saessakmaeul.bitamin.complaint.entity.UserStop;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface UserStopRepository extends JpaRepository<UserStop,Long> {
    void deleteByStopDateIsLessThan(LocalDateTime localDateTime);
}
