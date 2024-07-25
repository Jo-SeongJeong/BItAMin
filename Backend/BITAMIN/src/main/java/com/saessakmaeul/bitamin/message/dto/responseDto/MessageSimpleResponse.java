package com.saessakmaeul.bitamin.message.dto.responseDto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class MessageSimpleResponse {
    private long id;
    private String nickname;
    private String category;
    private String title;
    private LocalDate sendDate;
    private Boolean isRead;
}
