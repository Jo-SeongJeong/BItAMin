package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberBasicInfoResponse {
    private Long id;
    private String nickname;

    public MemberBasicInfoResponse(Long id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }
}
