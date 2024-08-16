package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
public class MemberMissionResponse {
    private Long id;
    private LocalDate completeDate;
    private String imageUrl;
    private String missionReview;
    private Long missionId;
    private Long userId;

    @Builder
    public MemberMissionResponse(Long id, LocalDate completeDate, String imageUrl, String missionReview, Long missionId, Long userId){
        this.id = id;
        this.completeDate = completeDate;
        this.imageUrl = imageUrl;
        this.missionReview = missionReview;
        this.missionId = missionId;
        this.userId = userId;
    }
}
