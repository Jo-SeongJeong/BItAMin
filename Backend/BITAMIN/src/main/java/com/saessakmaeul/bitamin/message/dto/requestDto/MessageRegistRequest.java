package com.saessakmaeul.bitamin.message.dto.requestDto;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class MessageRegistRequest {
    private long recieverId;
    private String category;
    private String title;
    private String content;
    private LocalDateTime counselingDate;
}
