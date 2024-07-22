package com.saessakmaeul.bitamin.consultations.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Participant {
    private final Long id;
    private final int memberId;
    private final String memberNickname;
    private final int consultationId;
    private final LocalDate date;

}
