package com.saessakmaeul.bitamin.message.dto.requestDto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReplyRegistRequest {
    private String content;
}
