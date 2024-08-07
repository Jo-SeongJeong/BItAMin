package com.saessakmaeul.bitamin.message.repository;

import com.saessakmaeul.bitamin.message.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    public List<Message> findByReceiverId(long receiverId);
    public List<Message> findBySenderId(long senderId);
}
