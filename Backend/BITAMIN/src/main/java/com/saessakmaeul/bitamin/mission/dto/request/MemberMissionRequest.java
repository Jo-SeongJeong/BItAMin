package com.saessakmaeul.bitamin.mission.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class MemberMissionRequest {
    private String completeDate;
    private String missionReview;
    private Long missionId;
    private MultipartFile missionImage;

    @Builder
    public MemberMissionRequest(String completeDate, String missionReview, Long missionId, MultipartFile missionImage) {
        this.completeDate = completeDate;
        this.missionReview = missionReview;
        this.missionId = missionId;
        this.missionImage = missionImage;
    }
}
