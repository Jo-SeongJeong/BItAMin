package com.saessakmaeul.bitamin.member.dto.response;

import com.saessakmaeul.bitamin.member.entity.Role;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Builder
public class MemberListResponse {
    private Long id;
    private String email;
    private String password;
    private String name;
    private String nickname;
    private String dongCode;
    private LocalDate birthday;
    private String profileUrl;
    private Role role;

}
