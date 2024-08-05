package com.saessakmaeul.bitamin.consultation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class SendMessageRequest {
//    private Long consultationId;
    private String memberNickname;
    private String content;
    private LocalDateTime sendTime;
}
