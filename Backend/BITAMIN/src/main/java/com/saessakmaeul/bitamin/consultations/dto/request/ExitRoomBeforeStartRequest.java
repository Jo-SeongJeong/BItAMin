package com.saessakmaeul.bitamin.consultations.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class ExitRoomBeforeStartRequest {
    private Long memberId;
    private Long ConsultationId;
}
