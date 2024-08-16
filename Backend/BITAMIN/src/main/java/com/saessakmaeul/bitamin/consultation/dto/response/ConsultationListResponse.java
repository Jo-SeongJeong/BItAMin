package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.time.LocalDateTime;


@AllArgsConstructor
@Getter
@EqualsAndHashCode
public class ConsultationListResponse {
    private Long id;
    private String category;
    private String title;
    private Boolean isPrivated;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int currentParticipants;
    private String sessionId;
}
