package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Getter
public class SavedMemberPhraseResponse {
    private Long id;
    private Long memberId;
    private Long phraseId;
    private String phraseContent;
    private LocalDate saveDate;
    private String phraseUrl;

    @Builder
    public SavedMemberPhraseResponse(Long id, Long memberId, Long phraseId, String phraseContent, LocalDate saveDate, String phraseUrl) {
        this.id = id;
        this.memberId = memberId;
        this.phraseId = phraseId;
        this.phraseContent = phraseContent;
        this.saveDate = saveDate;
        this.phraseUrl = phraseUrl;
    }
}
