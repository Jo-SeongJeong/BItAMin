package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JoinRoomResponse {
    private Long consultationId;
    private String token;
    private Long id;
    private Long memberId;
    private String memberNickname;
    private String profileKey;
    private String profileUrl;
}
