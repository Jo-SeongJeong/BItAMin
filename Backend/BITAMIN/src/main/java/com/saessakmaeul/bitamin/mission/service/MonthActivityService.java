package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.dto.response.ApiResponse;
import com.saessakmaeul.bitamin.mission.dto.response.MonthMissionAndPhraseResponse;
import com.saessakmaeul.bitamin.mission.entity.MemberMission;
import com.saessakmaeul.bitamin.mission.entity.MemberPhrase;
import com.saessakmaeul.bitamin.mission.repository.MemberMissionRepository;
import com.saessakmaeul.bitamin.mission.repository.MemberPhraseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MonthActivityService {

    private final MemberMissionRepository memberMissionRepository;
    private final MemberPhraseRepository memberPhraseRepository;

    public ApiResponse<List<MonthMissionAndPhraseResponse>> getActivitiesForMonth(Long memberId, String date) {
        // 전체 날짜에서 YearMonth 추출
        LocalDate parsedDate = LocalDate.parse(date, DateTimeFormatter.ISO_DATE);
        YearMonth yearMonth = YearMonth.from(parsedDate);

        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        List<MonthMissionAndPhraseResponse> responses = new ArrayList<>();

        for (LocalDate currentDate = startDate; !currentDate.isAfter(endDate); currentDate = currentDate.plusDays(1)) {
            Optional<MemberMission> missionOpt = memberMissionRepository.findByUserIdAndCompleteDate(memberId, currentDate);
            Optional<MemberPhrase> phraseOpt = memberPhraseRepository.findByMemberIdAndSaveDate(memberId, currentDate);

            if (missionOpt.isPresent() || phraseOpt.isPresent()) {
                MonthMissionAndPhraseResponse response = MonthMissionAndPhraseResponse.builder()
                        .memberMissionId(missionOpt.map(MemberMission::getId).orElse(null))
                        .memberPhraseId(phraseOpt.map(MemberPhrase::getId).orElse(null))
                        .activityDate(currentDate)
                        .build();
                responses.add(response);
            }
        }

        if(responses.isEmpty()) {
            return ApiResponse.<List<MonthMissionAndPhraseResponse>>builder()
                    .success(false)
                    .message("이번 달 미션 활동이 없습니다.")
                    .data(new ArrayList<>())
                    .build();
        }

        return ApiResponse.<List<MonthMissionAndPhraseResponse>>builder()
                .success(true)
                .message("월간 활동 조회에 성공했습니다.")
                .data(responses)
                .build();
    }
}
