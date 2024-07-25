package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberBasicInfo {
    private Long id;
    private String nickname;

    public MemberBasicInfo(Long id, String nickname) {
        this.id = id;
        this.nickname = nickname;
    }
}
