package com.saessakmaeul.bitamin.complaint.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "complaint")
@Getter
@Setter
public class Complaint {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "complainant_id")
    private long complainantId;

    @Column(name = "respondent_id")
    private long respondentId;

    @Column(name = "category")
    private int category;

    @Column(name = "content")
    private String content;

    @Column(name = "send_date")
    private LocalDateTime sendDate;

    @Column(name = "is_resolved")
    private Boolean isResolved;

    @Column(name = "judgement")
    private int judgement;

    @Column(name = "type")
    private int type;
}
