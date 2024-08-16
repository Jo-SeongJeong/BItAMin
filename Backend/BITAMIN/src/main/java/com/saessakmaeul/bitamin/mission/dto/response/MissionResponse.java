package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class MissionResponse {
    private Long id;
    private String missionName;
    private String missionDescription;
    private int missionLevel;

    @Builder
    public MissionResponse(Long id, String missionName, String missionDescription, int missionLevel) {
        this.id = id;
        this.missionName = missionName;
        this.missionDescription = missionDescription;
        this.missionLevel = missionLevel;
    }
}
