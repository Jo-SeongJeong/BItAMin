package com.saessakmaeul.bitamin.consultation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ExitRoomAfterStartRequest {
    private Long memberId;
    private Long ConsultationId;
}
