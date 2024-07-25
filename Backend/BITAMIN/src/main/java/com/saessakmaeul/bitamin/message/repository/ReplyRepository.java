package com.saessakmaeul.bitamin.message.repository;

import com.saessakmaeul.bitamin.message.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {
    List<Reply> findByMessageId(long id);
}
