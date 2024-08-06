package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.*;

import java.time.LocalDate;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class RecentParticipantResponse {
    private Long id;
    private Long memberId;
    private String memberNickname;
    private Long consultationId;
    private LocalDate consultationDate;
}
