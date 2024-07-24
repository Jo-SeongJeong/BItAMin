package com.saessakmaeul.bitamin.consultations.dto.request;

import com.saessakmaeul.bitamin.consultations.Entity.SearchCondition;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class JoinRandomRequest {
    private SearchCondition type;

    private Long memberId;
    private String memberNickname;
}
