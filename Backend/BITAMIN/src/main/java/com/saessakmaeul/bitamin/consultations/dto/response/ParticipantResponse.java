package com.saessakmaeul.bitamin.consultations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ParticipantResponse {
    private Long id;
    private Long memberId;
    private String memberNickname;
    private Long consultationId;
    private LocalDate consultationDate;
}
