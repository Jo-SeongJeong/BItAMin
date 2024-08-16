package com.saessakmaeul.bitamin.mission.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class MemberPhraseRequest {
    private Long phraseId;
    private String saveDate;
    private MultipartFile phraseRecord;

    @Builder
    public MemberPhraseRequest(Long phraseId, String saveDate, MultipartFile phraseRecord) {
        this.phraseId = phraseId;
        this.saveDate = saveDate;
        this.phraseRecord = phraseRecord;
    }
}
