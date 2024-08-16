package com.saessakmaeul.bitamin.mission.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class MemberPhrase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private Long id;

    @Column(name = "save_date")
    private LocalDate saveDate;

    @Column(name = "phrase_url")
    private String phraseUrl;

    @Column(name = "phrase_id")
    private Long phraseId;

    @Column(name = "member_id")
    private Long memberId;
}
