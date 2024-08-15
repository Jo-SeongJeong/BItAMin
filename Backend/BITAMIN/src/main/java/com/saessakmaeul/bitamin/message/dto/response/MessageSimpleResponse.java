package com.saessakmaeul.bitamin.message.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class MessageSimpleResponse {
    private long id;
    private String nickname;
    private String category;
    private String title;
    private LocalDateTime sendDate;
    private Boolean isRead;
    private String url;
}
