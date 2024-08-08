package com.saessakmaeul.bitamin.mission.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class PhraseResponse {
    private Long id;
    private String phraseContent;

    @Builder
    public PhraseResponse(Long id, String phraseContent) {
        this.id = id;
        this.phraseContent = phraseContent;
    }
}
