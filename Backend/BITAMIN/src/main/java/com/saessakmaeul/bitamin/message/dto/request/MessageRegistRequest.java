package com.saessakmaeul.bitamin.message.dto.request;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageRegistRequest {
    private long receiverId;
    private String category;
    private String title;
    private String content;
    private LocalDateTime counselingDate;
}
