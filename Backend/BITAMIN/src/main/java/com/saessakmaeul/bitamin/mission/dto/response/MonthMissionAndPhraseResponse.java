package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
public class MonthMissionAndPhraseResponse {
    private Long memberMissionId;
    private Long memberPhraseId;
    private LocalDate activityDate;

    @Builder
    public MonthMissionAndPhraseResponse(Long memberMissionId, Long memberPhraseId, LocalDate activityDate) {
        this.memberMissionId = memberMissionId;
        this.memberPhraseId = memberPhraseId;
        this.activityDate = activityDate;
    }
}
