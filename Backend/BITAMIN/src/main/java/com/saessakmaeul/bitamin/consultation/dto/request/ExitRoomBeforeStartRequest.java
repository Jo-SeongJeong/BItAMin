package com.saessakmaeul.bitamin.consultation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@AllArgsConstructor
@Getter
@Setter
public class ExitRoomBeforeStartRequest {
    private Long memberId;
    private Long consultationId;
}
