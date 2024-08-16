package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.response.ApiResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MissionDescriptionResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MissionResponse;
import com.saessakmaeul.bitamin.mission.entity.MemberMission;
import com.saessakmaeul.bitamin.mission.entity.Mission;
import com.saessakmaeul.bitamin.mission.repository.MemberMissionRepository;
import com.saessakmaeul.bitamin.mission.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissionService {

    private final MissionRepository missionRepository;
    private final MemberMissionRepository memberMissionRepository;

    // 데일리 미션 조회
    public ApiResponse<MissionResponse> readMission(Long memberId) {
        // 유저가 가장 최근에 한 미션 ID 조회
        Optional<MemberMission> recentMissionOpt = memberMissionRepository.findFirstByUserIdOrderByCompleteDateDesc(memberId);
        Long recentMissionId = recentMissionOpt.map(MemberMission::getMissionId).orElse(null);

        // 모든 미션 조회
        List<Mission> missions = missionRepository.findAll();

        // 모든 미션 -> 최근 미션을 제외한 리스트 생성
        List<Mission> filteredMissions;
        if(recentMissionId != null){ // 이전 미션이 있는 경우
            filteredMissions = missions.stream()
                    .filter(mission -> mission.getId() != recentMissionId)
                    .toList();
        } else{ // 이전 미션이 없는 뉴비인 경우
            filteredMissions = missions;
        }

        // 필터링 된 미션이 없을 때, false 메세지 반환
        if(filteredMissions.isEmpty()){
            return ApiResponse.<MissionResponse>builder()
                    .success(false)
                    .message("미션을 조회할 수 없습니다.")
                    .data(null)
                    .build();
        }

        // 무작위 미션 선택
        Random random = new Random();
        Mission randomMission = filteredMissions.get(random.nextInt(filteredMissions.size()));

        // MissionResponse로 반환
        MissionResponse response = MissionResponse.builder()
                .id(randomMission.getId())
                .missionName(randomMission.getMissionName())
                .missionDescription(randomMission.getMissionDescription())
                .missionLevel(randomMission.getMissionLevel())
                .build();

        return ApiResponse.<MissionResponse>builder()
                .success(true)
                .message("미션 조회에 성공했습니다.")
                .data(response)
                .build();
    }

    public ApiResponse<MissionDescriptionResponse> readMissionDescription(Long missionId) {
        // 해당 미션의 ID로 미션 조회
        Optional<Mission> targetMission = missionRepository.findById(missionId);

        // 미션을 잘못 조회했을 때, 해당 미션이 없다는 응답
        if(targetMission.isEmpty()){
            return ApiResponse.<MissionDescriptionResponse>builder()
                    .success(false)
                    .message("해당 id를 사용하는 미션이 없습니다.")
                    .data(null)
                    .build();
        }

        // 미션 정보 추출
        Mission mission = targetMission.get();

        // MissionDescriptionResponse로 변환
        MissionDescriptionResponse response = MissionDescriptionResponse.builder()
                .id(mission.getId())
                .missionDescription(mission.getMissionDescription())
                .build();

        return ApiResponse.<MissionDescriptionResponse>builder()
                .success(true)
                .message("미션 정보 조회에 성공했습니다.")
                .data(response)
                .build();
    }

    // 미션 교체
    public ApiResponse<MissionResponse> changeMission(Long missionId) {
        // 모든 미션 조회
        List<Mission> missions = missionRepository.findAll();

        // 모든 미션 -> 현재 미션을 제외한 미션 리스트 생성
        List<Mission> filteredMissions = missions.stream()
                .filter(mission -> mission.getId() != missionId)
                .toList();

        // 필터링 된 미션이 없을 때, false 메세지 반환
        if(filteredMissions.isEmpty()){
            return ApiResponse.<MissionResponse>builder()
                    .success(false)
                    .message("교체할 미션이 없습니다.")
                    .data(null)
                    .build();
        }

        // 무작위 미션 선택
        Random random = new Random();
        Mission randomMission = filteredMissions.get(random.nextInt(filteredMissions.size()));

        // MissionResponse로 반환
        MissionResponse response = MissionResponse.builder()
                .id(randomMission.getId())
                .missionName(randomMission.getMissionName())
                .missionDescription(randomMission.getMissionDescription())
                .missionLevel(randomMission.getMissionLevel())
                .build();

        // MissionResponse로 반환
        return ApiResponse.<MissionResponse>builder()
                .success(true)
                .message("미션 조회에 성공했습니다.")
                .data(response)
                .build();
    }


}
