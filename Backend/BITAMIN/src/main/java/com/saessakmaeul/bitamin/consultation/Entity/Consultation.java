package com.saessakmaeul.bitamin.consultation.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "consultation")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column
    private String category;

    @Column
    private String title;

    @Column(name = "is_privated")
    private Boolean isPrivated;

    @Column
    private String password;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "current_participants")
    private int currentParticipants;

    @Column(name = "session_id")
    private String sessionId;

}
