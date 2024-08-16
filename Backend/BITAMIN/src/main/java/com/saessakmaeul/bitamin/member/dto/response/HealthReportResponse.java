package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class HealthReportResponse {
    private Long id;
    private int checkupScore;
    private LocalDate checkupDate;
    private Long memberId;
}
