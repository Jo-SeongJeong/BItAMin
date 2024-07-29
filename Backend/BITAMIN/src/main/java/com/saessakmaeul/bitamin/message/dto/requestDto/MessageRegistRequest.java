package com.saessakmaeul.bitamin.message.dto.requestDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MessageRegistRequest {
    private long recieverId;
    private String category;
    private String title;
    private String content;
    private LocalDateTime counselingDate;
}
