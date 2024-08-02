package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@EqualsAndHashCode
public class RegistRoomResponse {
    private Long id;
    private Boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private String sessionId;
}
