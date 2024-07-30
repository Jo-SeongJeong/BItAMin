package com.saessakmaeul.bitamin.exercise.dto.responseDto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;

@Builder
public class ExcersizeDetailResponse {
    private long id;

    private String title;

    private String description;

    private int level;

    private String exerciseKey;

    private String exerciseUrl;
}
