package com.saessakmaeul.bitamin.message.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Getter
public class MessageDetailResponse {
    private long id;
    private String nickname;
    private long opponentId;
    private String category;
    private String title;
    private String content;
    private LocalDateTime sendDate;
    private LocalDateTime counselingDate;
    private Boolean isRead;
    private String url;
    private List<Replies> replies;
}
