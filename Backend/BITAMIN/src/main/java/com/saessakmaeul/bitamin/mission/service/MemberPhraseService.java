package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.request.MemberPhraseRequest;
import com.saessakmaeul.bitamin.mission.dto.response.ApiResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MemberPhraseResponse;
import com.saessakmaeul.bitamin.mission.dto.response.SavedMemberPhraseResponse;
import com.saessakmaeul.bitamin.mission.entity.MemberPhrase;
import com.saessakmaeul.bitamin.mission.entity.Phrase;
import com.saessakmaeul.bitamin.mission.repository.MemberPhraseRepository;
import com.saessakmaeul.bitamin.mission.repository.PhraseRepository;
import com.saessakmaeul.bitamin.util.file.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberPhraseService {

    private final MemberPhraseRepository memberPhraseRepository;
    private final S3Service s3Service;
    private final PhraseRepository phraseRepository;

    // 녹음한 문구 조회하기
    public ApiResponse<SavedMemberPhraseResponse> readSavedMemberPhrase(Long memberId, String date) {
        // 녹음된 날짜 형변환
        LocalDate savedDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);

        // 유저가 해당 날짜에 녹음한 문구 조회
        Optional<MemberPhrase> memberPhraseOpt = memberPhraseRepository.findByMemberIdAndSaveDate(memberId,savedDate);

        if(memberPhraseOpt.isEmpty()){
            return ApiResponse.<SavedMemberPhraseResponse>builder()
                    .success(false)
                    .message("해당 날짜에 녹음한 문구가 없습니다.")
                    .data(null)
                    .build();
        }

        MemberPhrase savedMemberPhrase = memberPhraseOpt.get();
        Long savedPhraseId = savedMemberPhrase.getPhraseId();

        // 문구 ID를 통해서 해당 문구 조회
        Optional<Phrase> savedPhraseOpt = phraseRepository.findById(savedPhraseId);
        if(savedPhraseOpt.isEmpty()){
            return ApiResponse.<SavedMemberPhraseResponse>builder()
                    .success(false)
                    .message("해당 문구가 없습니다.")
                    .data(null)
                    .build();
        }

        Phrase savedPhrase = savedPhraseOpt.get();

        // SavedMemberMissionResponse로 반환
        SavedMemberPhraseResponse response = SavedMemberPhraseResponse.builder()
                .id(savedMemberPhrase.getId())
                .memberId(savedMemberPhrase.getMemberId())
                .phraseId(savedMemberPhrase.getPhraseId())
                .phraseContent(savedPhrase.getPhraseContent())
                .saveDate(savedMemberPhrase.getSaveDate())
                .phraseUrl(savedMemberPhrase.getPhraseUrl())
                .build();

        return ApiResponse.<SavedMemberPhraseResponse>builder()
                .success(true)
                .message("문구 조회에 성공했습니다.")
                .data(response)
                .build();
    }

    // 오늘의 문구 녹음 등록
    @Transactional
    public ApiResponse<MemberPhraseResponse> createMemberPhrase(Long memberId, MemberPhraseRequest memberPhraseRequest) throws IOException {
        // MemberPhraseRequest에서 LocalDate로 변환
        LocalDate saveDate = LocalDate.parse(memberPhraseRequest.getSaveDate(), DateTimeFormatter.ISO_DATE);

        // S3에 녹음파일 업로드
        MultipartFile phraseRecord = memberPhraseRequest.getPhraseRecord();
        String phraseUrl = null;
        if(phraseRecord != null && !phraseRecord.isEmpty()) {
            phraseUrl = s3Service.uploadFile(phraseRecord);
        }

        // MemberPhrase 엔티티 생성
        MemberPhrase memberPhrase = new MemberPhrase();
        memberPhrase.setSaveDate(saveDate);
        memberPhrase.setPhraseUrl(phraseUrl);
        memberPhrase.setPhraseId(memberPhraseRequest.getPhraseId());
        memberPhrase.setMemberId(memberId);

        // 저장하기
        MemberPhrase savedMemberPhrase = memberPhraseRepository.save(memberPhrase);

        MemberPhraseResponse response = MemberPhraseResponse.builder()
                .id(savedMemberPhrase.getId())
                .memberId(savedMemberPhrase.getMemberId())
                .phraseId(savedMemberPhrase.getPhraseId())
                .saveDate(savedMemberPhrase.getSaveDate())
                .phraseUrl(savedMemberPhrase.getPhraseUrl())
                .build();

        return ApiResponse.<MemberPhraseResponse>builder()
                .success(true)
                .message("문구 녹음 등록에 성공했습니다.")
                .data(response)
                .build();
    }


}
