package com.saessakmaeul.bitamin.mission.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class MemberMission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "complete_date", nullable = false)
    private LocalDate completeDate;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "mission_review")
    private String missionReview;

    @Column(name = "mission_id", nullable = false)
    private Long missionId;

    @Column(name = "user_id", nullable = false)
    private Long userId;
}