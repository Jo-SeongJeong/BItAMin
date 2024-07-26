package com.saessakmaeul.bitamin.consultations.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class RegistChatingRequest {
    private Long consultationId;
    private Long memberId;
    private String memberNickname;
    private String content;
}
