package com.saessakmaeul.bitamin.mission.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "phrase")
@Getter
@Setter
public class Phrase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "phrase_content", nullable = false)
    private String phraseContent;

}
