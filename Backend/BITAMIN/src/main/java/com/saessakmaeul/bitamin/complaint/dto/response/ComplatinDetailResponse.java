package com.saessakmaeul.bitamin.complaint.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
public class ComplatinDetailResponse {
    private long id;

    private String complainantNickname;

    private String respondentNickname;

    private String content;

    private int category;

    private LocalDateTime sendDate;
    // 현재 정지 기간
    private int stopDate;
    // 역대 정지 횟수
    private int judgementCount;
    // 역대 정지 기간
    private int judgementDate;
    // 신고 type
    private int type;
}
