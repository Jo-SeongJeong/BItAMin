package com.saessakmaeul.bitamin.consultations.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class FindByIdResponse {
    private Long id;
    private String content;
    private LocalDateTime sendTime;
    private Long memberId;
    private String memberNickname;
    private Long consultationId;
}
