package com.saessakmaeul.bitamin.member.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Setter
@Builder
public class MemberUpdateRequestDTO {
    private String name;
    private String nickname;
    private String dongCode;
    private Date birthday;
    private String profileKey;
    private String profileUrl;
    private MultipartFile profileImage;
}
