package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class MemberExperienceResponse {
    private Long id;
    private int experience;

    @Builder
    public MemberExperienceResponse(Long id, int experience) {
        this.id = id;
        this.experience = experience;
    }
}
