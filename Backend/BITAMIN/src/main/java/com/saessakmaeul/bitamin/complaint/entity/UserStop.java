package com.saessakmaeul.bitamin.complaint.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_stop")
public class UserStop {
    @Id
    @Column(name = "id")
    private long id;

    @Column(name = "stop_date")
    private LocalDateTime stopDate;
}
