package com.saessakmaeul.bitamin.member.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class HealthReportRequestDTO {
    private int checkupScore;
    private LocalDate checkupDate;
    private Long memberId;
}
