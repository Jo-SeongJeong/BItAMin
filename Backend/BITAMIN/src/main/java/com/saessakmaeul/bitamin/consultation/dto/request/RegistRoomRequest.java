package com.saessakmaeul.bitamin.consultation.dto.request;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class RegistRoomRequest {
    private SearchCondition category;
    private String title;
    private Boolean isPrivated;
    private String password;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String sessionId;
}
