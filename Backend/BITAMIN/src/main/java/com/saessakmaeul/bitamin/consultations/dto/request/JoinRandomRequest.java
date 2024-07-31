package com.saessakmaeul.bitamin.consultations.dto.request;

import com.saessakmaeul.bitamin.consultations.Entity.SearchCondition;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
@Setter
public class JoinRandomRequest {
    private Long id;
    private SearchCondition type;
    private String sessionId;

    private Long memberId;
    private String memberNickname;
    private LocalDate consultationDate;
}
