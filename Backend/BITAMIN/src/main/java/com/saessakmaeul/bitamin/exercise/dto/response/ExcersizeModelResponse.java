package com.saessakmaeul.bitamin.exercise.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ExcersizeModelResponse {
    private long id;

    private String modelUrl;

    private long firstExercise;

    private long secondExercise;

    private long thirdExercise;
}
