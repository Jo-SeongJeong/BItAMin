package com.saessakmaeul.bitamin.message.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "message")
@Getter
@Setter
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "sender_id")
    private long senderId;

    @Column(name = "reciever_id")
    private long receiverId;

    @Column(name = "category")
    private String category;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "send_date")
    private LocalDateTime sendDate;

    @Column(name= "counseling_date")
    private LocalDateTime counselingDate;

    @Column(name = "is_read")
    private Boolean isRead;

    @Column(name = "is_deleted")
    private int isDeleted;
}
