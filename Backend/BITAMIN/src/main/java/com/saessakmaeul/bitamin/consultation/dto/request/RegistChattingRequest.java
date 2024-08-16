package com.saessakmaeul.bitamin.consultation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class RegistChattingRequest {
    private Long consultationId;
    private Long memberId;
    private String memberNickname;
    private String content;
}
