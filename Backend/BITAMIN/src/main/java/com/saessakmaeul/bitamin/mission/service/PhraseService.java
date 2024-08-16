package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.response.ApiResponse;
import com.saessakmaeul.bitamin.mission.dto.response.PhraseResponse;
import com.saessakmaeul.bitamin.mission.entity.Phrase;
import com.saessakmaeul.bitamin.mission.repository.PhraseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PhraseService {

    private final PhraseRepository phraseRepository;

    // 데일리 문구 조회
    public ApiResponse<PhraseResponse> readPhrase() {
        // 모든 문구 조회
        List<Phrase> phrases = phraseRepository.findAll();

        // 무작위 문구 선택
        Random random = new Random();
        Phrase ramdomPhrase = phrases.get(random.nextInt(phrases.size()));

        // PhraseResponse로 전환
        PhraseResponse response = PhraseResponse.builder()
                .id(ramdomPhrase.getId())
                .phraseContent(ramdomPhrase.getPhraseContent())
                .build();

        return ApiResponse.<PhraseResponse>builder()
                .success(true)
                .message("문구 조회에 성공했습니다.")
                .data(response)
                .build();
    }
}
