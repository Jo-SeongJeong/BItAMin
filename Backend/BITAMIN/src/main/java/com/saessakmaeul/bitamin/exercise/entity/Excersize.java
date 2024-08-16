package com.saessakmaeul.bitamin.exercise.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "ai_exercise")
@Getter
public class Excersize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "title")
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "level")
    private int level;

    @Column(name = "exercise_url")
    private String exerciseUrl;
}
