package com.saessakmaeul.bitamin.exercise.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ExcersizeDetailResponse {
    private long id;

    private String title;

    private String description;

    private int level;

    private String exerciseUrl;
}
