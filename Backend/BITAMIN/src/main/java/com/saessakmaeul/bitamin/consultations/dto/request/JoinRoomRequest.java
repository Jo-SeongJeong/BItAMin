package com.saessakmaeul.bitamin.consultations.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class JoinRoomRequest {
//    private Long id;
    private LocalDateTime startTime;

    private Long memberId;
    private String memberNickname;
    private Long consultationId;
    private LocalDate consultationDate;
}
