package com.saessakmaeul.bitamin.member.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private boolean success;

    public AuthResponse(String accessToken, String refreshToken, boolean success) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.success = success;
    }
}
