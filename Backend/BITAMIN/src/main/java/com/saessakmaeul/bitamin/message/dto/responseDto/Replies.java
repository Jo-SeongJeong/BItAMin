package com.saessakmaeul.bitamin.message.dto.responseDto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Getter
public class Replies {
    private long id;
    private String memberNickName;
    private String content;
    private Boolean isRead;
    private LocalDateTime sendDate;
}
