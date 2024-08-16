package com.saessakmaeul.bitamin.consultation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class JoinRoomRequest {
    private Long id;
    private Boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private String sessionId;

    private Long memberId;
    private String memberNickname;
    private LocalDate consultationDate;
}
