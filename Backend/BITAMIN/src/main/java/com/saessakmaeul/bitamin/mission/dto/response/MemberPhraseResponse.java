package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
public class MemberPhraseResponse {
    private Long id;
    private Long memberId;
    private Long phraseId;
    private LocalDate saveDate;
    private String phraseUrl;

    @Builder
    public MemberPhraseResponse(Long id, Long memberId, Long phraseId, LocalDate saveDate, String phraseUrl) {
        this.id = id;
        this.memberId = memberId;
        this.phraseId = phraseId;
        this.saveDate = saveDate;
        this.phraseUrl = phraseUrl;
    }
}
