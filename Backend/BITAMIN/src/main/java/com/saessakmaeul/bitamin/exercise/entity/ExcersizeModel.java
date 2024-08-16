package com.saessakmaeul.bitamin.exercise.entity;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "ai_exercise_model")
@Getter
public class ExcersizeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "level")
    private int level;

    @Column(name = "model_url")
    private String modelUrl;

    @Column(name = "first_exercise")
    private long firstExercise;

    @Column(name = "second_exercise")
    private long secondExercise;

    @Column(name = "third_exercise")
    private long thirdExercise;
}
