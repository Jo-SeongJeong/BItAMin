package com.saessakmaeul.bitamin.complaint.dto.requestDto;

import lombok.Getter;

@Getter
public class ComplaintRegistRequest {
    private long respondentId;

    private int category;

    private String content;

    private int type;
}
