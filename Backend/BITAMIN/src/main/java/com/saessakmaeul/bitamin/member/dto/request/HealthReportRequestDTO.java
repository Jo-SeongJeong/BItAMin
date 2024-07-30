package com.saessakmaeul.bitamin.member.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class HealthReportRequestDTO {
    private int checkupScore;
    private Date checkupDate;
    private Long memberId;
}
