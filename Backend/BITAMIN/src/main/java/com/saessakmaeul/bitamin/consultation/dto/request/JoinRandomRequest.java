package com.saessakmaeul.bitamin.consultation.dto.request;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
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
