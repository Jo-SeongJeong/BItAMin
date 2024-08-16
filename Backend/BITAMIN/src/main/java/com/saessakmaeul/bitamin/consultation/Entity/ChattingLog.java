package com.saessakmaeul.bitamin.consultation.Entity;

import com.saessakmaeul.bitamin.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chatting_log")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChattingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @Column
    private String content;

    @Column(name = "send_time", insertable = false)
    private LocalDateTime sendTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member memberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id", referencedColumnName = "id")
    private Consultation consultationId;

    @Column(name = "member_nickname")
    private String memberNickname;
}
