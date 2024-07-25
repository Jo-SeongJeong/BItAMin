package com.saessakmaeul.bitamin.message.repository;

import com.saessakmaeul.bitamin.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}
