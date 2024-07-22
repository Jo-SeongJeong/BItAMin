package com.saessakmaeul.bitamin.consultations.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatingLog {
    private final Long id;
    private final String content;
    private final LocalDateTime sendTime;
    private final Long memberId;
    private final Long consultationId;
    private final String memberNickname;
}
