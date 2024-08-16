package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.response.ApiResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MemberExperienceResponse;
import com.saessakmaeul.bitamin.mission.entity.UserExperience;
import com.saessakmaeul.bitamin.mission.repository.MemberExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExperienceService {

    private final MemberExperienceRepository memberExperienceRepository;

    public ApiResponse<MemberExperienceResponse> readExperience(Long memberId) {
        // memberId로 경험치 조회
        Optional<UserExperience> memberExperienceOpt = memberExperienceRepository.findById(memberId);

        if(memberExperienceOpt.isEmpty()) {
            return ApiResponse.<MemberExperienceResponse>builder()
                    .success(false)
                    .message("해당 유저의 경험치를 조회할 수 없습니다.")
                    .data(null)
                    .build();
        }

        UserExperience memberExperience = memberExperienceOpt.get();

        MemberExperienceResponse reponse = MemberExperienceResponse.builder()
                .id(memberExperience.getId())
                .experience(memberExperience.getExperience())
                .build();

        return ApiResponse.<MemberExperienceResponse>builder()
                .success(true)
                .message("경험치 조회에 성공했습니다.")
                .data(reponse)
                .build();
    }
}
