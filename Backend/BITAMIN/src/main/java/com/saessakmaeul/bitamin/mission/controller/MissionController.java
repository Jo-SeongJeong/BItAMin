package com.saessakmaeul.bitamin.mission.controller;

import com.saessakmaeul.bitamin.mission.dto.request.MemberMissionRequest;
import com.saessakmaeul.bitamin.mission.dto.request.MemberPhraseRequest;
import com.saessakmaeul.bitamin.mission.dto.response.*;
import com.saessakmaeul.bitamin.mission.service.*;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;
    private final ExperienceService experienceService;
    private final PhraseService phraseService;
    private final MemberPhraseService memberPhraseService;
    private final JwtUtil jwtUtil;
    private final MonthActivityService monthActivityService;
    private final MemberMissionService memberMissionService;

    // 데일리 미션 조회
    @GetMapping
    public ApiResponse<MissionResponse> getMission(@RequestHeader(value = "Authorization", required = false) String tokenHeader){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        ApiResponse<MissionResponse> missionResponse = missionService.readMission(memberId);
        return missionResponse;
    }

    // 미션 설명 보기
    @GetMapping("/description")
    public ApiResponse<MissionDescriptionResponse> getMissionDescription(@RequestParam("missionId") Long missionId){

        // Service 호출
        ApiResponse<MissionDescriptionResponse> missionDescription = missionService.readMissionDescription(missionId);
        return missionDescription;
    }

    // 미션 교체
    @GetMapping("/substitute")
    public ApiResponse<MissionResponse> getMissionSubstitute(@RequestParam("missionId") Long missionId){
        // Service 호출
        ApiResponse<MissionResponse> missionResponse = missionService.changeMission(missionId);
        return missionResponse;
    }

    // 완료한 미션 조회 기능
    @GetMapping("/completed")
    public ApiResponse<CompletedMemberMissionResponse> getMissionCompleted(@RequestHeader(value = "Authorization", required = false) String tokenHeader
                                               , @RequestParam("date") String date){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        ApiResponse<CompletedMemberMissionResponse> completedMemberMissionResponse = memberMissionService.completedMission(memberId, date);
        return completedMemberMissionResponse;
    }

    // 미션 리뷰 등록 기능
    @PostMapping
    public ApiResponse<MemberMissionResponse> postMission(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                             @RequestPart("memberMissionRequest") MemberMissionRequest memberMissionRequest,
                                             @RequestPart("missionImage") MultipartFile missionImage) throws IOException {
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // MemberMissionRequest에 missionImage 설정
        memberMissionRequest.setMissionImage(missionImage);

        // Service 호출
        ApiResponse<MemberMissionResponse> memberMissionResponse = memberMissionService.createMemberMission(memberId, memberMissionRequest);
        return memberMissionResponse;
    }

    // 반려 식물 경험치 조회 기능
    @GetMapping("/plant")
    public ApiResponse<MemberExperienceResponse> getExperience(@RequestHeader(value = "Authorization", required = false) String tokenHeader){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        ApiResponse<MemberExperienceResponse> memberExperienceResponse = experienceService.readExperience(memberId);
        return memberExperienceResponse;
    }

    // 오늘의 문구 조회 기능
    @GetMapping("/phrases")
    public ApiResponse<PhraseResponse> getPhrase(){
        // Service 호출
        ApiResponse<PhraseResponse> phraseResponse = phraseService.readPhrase();
        return phraseResponse;
    }

    // 오늘의 녹음 등록 기능
    @PostMapping("/phrases")
    public ApiResponse<MemberPhraseResponse> postPhrase(@RequestHeader(value = "Authorization", required = false) String tokenHeader
                                    , @RequestPart("memberPhraseRequest") MemberPhraseRequest memberPhraseRequest
                                    , @RequestPart("phraseRecord") MultipartFile phraseRecord) throws IOException {
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // MemberPhraseRequest에 phraseRecord 설정
        memberPhraseRequest.setPhraseRecord(phraseRecord);

        // Service 호출
        ApiResponse<MemberPhraseResponse> memberPhraseResponse = memberPhraseService.createMemberPhrase(memberId, memberPhraseRequest);
        return memberPhraseResponse;
    }

    // 오늘의 문구 녹음 조회 기능
    @GetMapping("/phrases/recorded")
    public ApiResponse<SavedMemberPhraseResponse> getSavedMemberPhrase(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                          @RequestParam("date") String date){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        ApiResponse<SavedMemberPhraseResponse> savedMemberPhrasesResponse = memberPhraseService.readSavedMemberPhrase(memberId, date);
        return savedMemberPhrasesResponse;
    }

    // 이번 달 진행한 미션과 녹음 리스트 조회
    @GetMapping("/month")
    public ApiResponse<List<MonthMissionAndPhraseResponse>> getMonthMissionAndPhrase(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                                        @RequestParam String date){
        // ID 추출
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        // Service 호출
        ApiResponse<List<MonthMissionAndPhraseResponse>> monthMissionAndPhraseResponses = monthActivityService.getActivitiesForMonth(memberId, date);
        return monthMissionAndPhraseResponses;
    }

}
