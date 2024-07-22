package com.saessakmaeul.bitamin.consultations.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Consultation {
    private final Long id;
    private final String category;
    private final String title;
    private final int isPrivate;
    private final String password;
    private final LocalDateTime startTime;
    private final LocalDateTime endTime;
    private final int currentParticipants;
}
