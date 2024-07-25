package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class HealthReportResponseDTO {
    private Long id;
    private int checkupScore;
    private Date checkupDate;
    private Long memberId;
}
