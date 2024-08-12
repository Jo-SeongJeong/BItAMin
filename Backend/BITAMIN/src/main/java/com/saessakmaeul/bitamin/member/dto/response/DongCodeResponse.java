package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class DongCodeResponse {
    private String sidoName;
    private String gugunName;
    private String dongName;
    private String xCoordinate;
    private String yCoordinate;
    private String lat;
    private String lng;
}
