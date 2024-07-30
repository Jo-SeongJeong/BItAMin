package com.saessakmaeul.bitamin.complaint.dto.responseDto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class ComplaintSimpleResponse {
    private long id;

    private String complainantNickname;

    private  String respondentNickname;

    private LocalDateTime sendDate;
}
