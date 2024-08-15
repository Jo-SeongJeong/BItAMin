package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class MissionDescriptionResponse {
    private Long id;
    private String missionDescription;

    @Builder
    public MissionDescriptionResponse(Long id, String missionDescription) {
        this.id = id;
        this.missionDescription = missionDescription;
    }
}
