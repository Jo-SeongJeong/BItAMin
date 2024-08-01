package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class RegistRoomResponse {
    private Long id;
    private Boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private String sessionId;
}
