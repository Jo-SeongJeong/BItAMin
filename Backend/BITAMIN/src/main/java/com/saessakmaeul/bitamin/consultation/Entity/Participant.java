package com.saessakmaeul.bitamin.consultation.Entity;

import com.saessakmaeul.bitamin.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "participant")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", referencedColumnName = "id")
    private Member memberId;

    @Column(name = "member_nickname")
    private String memberNickname;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultation_id", referencedColumnName = "id")
    private Consultation consultationId;

    @Column(name = "consultation_date")
    private LocalDate consultationDate;

}
