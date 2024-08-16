package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.request.MemberMissionRequest;
import com.saessakmaeul.bitamin.mission.dto.response.ApiResponse;
import com.saessakmaeul.bitamin.mission.dto.response.CompletedMemberMissionResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MemberMissionResponse;
import com.saessakmaeul.bitamin.mission.entity.MemberMission;
import com.saessakmaeul.bitamin.mission.entity.Mission;
import com.saessakmaeul.bitamin.mission.entity.UserExperience;
import com.saessakmaeul.bitamin.mission.repository.MemberExperienceRepository;
import com.saessakmaeul.bitamin.mission.repository.MemberMissionRepository;
import com.saessakmaeul.bitamin.mission.repository.MissionRepository;
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
public class MemberMissionService {

    private final MissionRepository missionRepository;
    private final MemberMissionRepository memberMissionRepository;
    private final MemberExperienceRepository memberExperienceRepository;
    private final S3Service s3Service;

    // 유저가 완료한 미션 조회
    public ApiResponse<CompletedMemberMissionResponse> completedMission(Long memberId, String date) {
        // 유저가 미션 수행한 날짜 형변환
        LocalDate completeDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);

        // 유저가 해당 날짜에 한 미션 ID 조회
        Optional<MemberMission> memberMissionOpt = memberMissionRepository.findByUserIdAndCompleteDate(memberId, completeDate);

        // 미션이 없을 경우, false 메세지 리턴
        if(memberMissionOpt.isEmpty()){
            return ApiResponse.<CompletedMemberMissionResponse>builder()
                    .success(false)
                    .message("해당 날짜에 수행한 미션이 없습니다.")
                    .data(null)
                    .build();
        }

        MemberMission completedMemberMission = memberMissionOpt.get();
        Long completedMissionId = completedMemberMission.getMissionId();

        // 미션 ID를 통해서 해당 미션 찾기
        Optional<Mission> completedMissionOpt = missionRepository.findById(completedMissionId);
        if(completedMissionOpt.isEmpty()){
            return ApiResponse.<CompletedMemberMissionResponse>builder()
                    .success(false)
                    .message("해당 미션이 없습니다.")
                    .data(null)
                    .build();
        }

        Mission completedMission = completedMissionOpt.get();

        // MissionResponse로 반환
        CompletedMemberMissionResponse response = CompletedMemberMissionResponse.builder()
                .id(completedMemberMission.getId())
                .missionId(completedMission.getId())
                .missionName(completedMission.getMissionName())
                .missionDescription(completedMission.getMissionDescription())
                .missionLevel(completedMission.getMissionLevel())
                .completeDate(completedMemberMission.getCompleteDate())
                .imageUrl(completedMemberMission.getImageUrl())
                .missionReview(completedMemberMission.getMissionReview())
                .userId(completedMemberMission.getUserId())
                .build();

        // MissionResponse로 반환
        return ApiResponse.<CompletedMemberMissionResponse>builder()
                .success(true)
                .message("미션 조회에 성공했습니다.")
                .data(response)
                .build();
    }

    // 미션 등록
    @Transactional
    public ApiResponse<MemberMissionResponse> createMemberMission(Long memberId, MemberMissionRequest memberMissionRequest) throws IOException {
        // MemberMissionRequest에서 LocalDate로 변환
        LocalDate completeDate = LocalDate.parse(memberMissionRequest.getCompleteDate(), DateTimeFormatter.ISO_DATE);

        // S3에 이미지 업로드
        MultipartFile missionImage = memberMissionRequest.getMissionImage();
        String imageUrl = null;
        if(missionImage!=null && !missionImage.isEmpty()){
            imageUrl = s3Service.uploadFile(missionImage);
        }

        // MemberMission 엔티티 생성
        MemberMission memberMission = new MemberMission();
        memberMission.setCompleteDate(completeDate);
        memberMission.setImageUrl(imageUrl);
        memberMission.setMissionId(memberMissionRequest.getMissionId());
        memberMission.setMissionReview(memberMissionRequest.getMissionReview());
        memberMission.setUserId(memberId);

        // 저장하기
        MemberMission savedMemberMission = memberMissionRepository.save(memberMission);

        // 유저의 경험치 업데이트
        updateExperience(memberId);

        MemberMissionResponse response = MemberMissionResponse.builder()
                .id(savedMemberMission.getId())
                .completeDate(savedMemberMission.getCompleteDate())
                .imageUrl(savedMemberMission.getImageUrl())
                .missionId(savedMemberMission.getMissionId())
                .missionReview(savedMemberMission.getMissionReview())
                .userId(savedMemberMission.getUserId())
                .build();

        return ApiResponse.<MemberMissionResponse>builder()
                .success(true)
                .message("미션 등록이 완료되었습니다.")
                .data(response)
                .build();
    }

    private void updateExperience(Long memberId) {
        UserExperience userExperience = memberExperienceRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("다음 아이디에 대한 유저 경험치가 조회되지 않았습니다: " + memberId));

        userExperience.setExperience(userExperience.getExperience() + 5);
        memberExperienceRepository.save(userExperience);
    }
}
