package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode
public class JoinRandomResponse {
    private Long consultationId;
    private String sessionId;
    private String token;
    private Long id;
    private Long memberId;
    private String memberNickname;
    private String profileUrl;
}
