package com.saessakmaeul.bitamin.member.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class MemberUpdateRequest {
    private String name;
    private String nickname;
    private String sidoName;
    private String gugunName;
    private String dongName;
    private LocalDate birthday;
    private String profileUrl;
}
