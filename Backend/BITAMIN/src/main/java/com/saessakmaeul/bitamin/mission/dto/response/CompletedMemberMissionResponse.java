package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
public class CompletedMemberMissionResponse {
    private Long id;
    private LocalDate completeDate;
    private String imageUrl;
    private String missionReview;
    private Long missionId;
    private Long userId;
    private String missionName;
    private String missionDescription;
    private int missionLevel;

    @Builder
    public CompletedMemberMissionResponse(Long id, LocalDate completeDate, String imageUrl, String missionReview, Long missionId, Long userId, String missionName, String missionDescription, int missionLevel){
        this.id = id;
        this.completeDate = completeDate;
        this.imageUrl = imageUrl;
        this.missionReview = missionReview;
        this.missionId = missionId;
        this.userId = userId;
        this.missionName = missionName;
        this.missionDescription = missionDescription;
        this.missionLevel = missionLevel;
    }
}
