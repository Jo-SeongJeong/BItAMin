package com.saessakmaeul.bitamin.message.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "reply")
@Getter
@Setter
public class Reply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "message_id")
    private long messageId;

    @Column(name = "member_id")
    private long memberId;

    @Column(name = "content")
    private String content;

    @Column(name = "send_date")
    private LocalDateTime sendDate;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "is_deleted")
    private int isDeleted;
}
