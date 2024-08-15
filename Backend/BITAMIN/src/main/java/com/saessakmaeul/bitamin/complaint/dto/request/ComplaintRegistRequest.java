package com.saessakmaeul.bitamin.complaint.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ComplaintRegistRequest {
    private long respondentId;

    private int category;

    private String content;

    private int type;
}
