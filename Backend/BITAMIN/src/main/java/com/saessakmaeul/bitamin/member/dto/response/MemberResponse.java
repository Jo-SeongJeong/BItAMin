package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class MemberResponse {
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String sidoName;
    private String gugunName;
    private String dongName;
    private String xCoordinate;
    private String yCoordinate;
    private String lat;
    private String lng;
    private LocalDate birthday;
    private String profileUrl;
}
