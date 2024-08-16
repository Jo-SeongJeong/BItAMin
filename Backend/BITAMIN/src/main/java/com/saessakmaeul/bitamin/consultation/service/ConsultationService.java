package com.saessakmaeul.bitamin.consultation.service;

import com.saessakmaeul.bitamin.consultation.Entity.ChattingLog;
import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import com.saessakmaeul.bitamin.consultation.Entity.Participant;
import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.*;
import com.saessakmaeul.bitamin.consultation.dto.response.*;
import com.saessakmaeul.bitamin.consultation.repository.ChattingLogRepository;
import com.saessakmaeul.bitamin.consultation.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultation.repository.ParticipantRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConsultationService {
    private final ConsultationRepository consultationRepository;
    private final ParticipantRepository participantRepository;
    private final MemberRepository memberRepository;
    private final ChattingLogRepository chattingLogRepository;

    // 방 리스트 조회
    public SelectAllResponse selectAll(int page, int size, SearchCondition type) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        Page<Consultation> consultationPage;

        if(type == null || type == SearchCondition.전체 ) consultationPage = consultationRepository.findBySessionIdIsNotNullAndCurrentParticipantsBetween(1,4, pageable);

        else if(type == SearchCondition.비밀방) consultationPage = consultationRepository.findByIsPrivatedAndSessionIdIsNotNullAndCurrentParticipantsBetween(true, 1,4, pageable);

        else if(type != SearchCondition.요약) consultationPage = consultationRepository.findByCategoryAndSessionIdIsNotNullAndCurrentParticipantsBetween(type.name(), 1, 4, pageable);

        else return null;

        List<ConsultationListResponse> list  = consultationPage.getContent().stream()
                .map(domain -> new ConsultationListResponse(
                        domain.getId(),
                        domain.getCategory(),
                        domain.getTitle(),
                        domain.getIsPrivated(),
                        domain.getStartTime(),
                        domain.getEndTime(),
                        domain.getCurrentParticipants(),
                        domain.getSessionId()
                ))
                .toList();

        return SelectAllResponse.builder()
                .consultationList(list)
                .page(page)
                .size(size)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();
    }

    @Transactional
    public RegistRoomResponse registRoom(RegistRoomRequest registRoomRequest) {
        // enum을 통한 category 데이터 검증
        String category ="";

        switch (registRoomRequest.getCategory()) {
            case 음악 :
                category = "음악";
                break;
            case 미술 :
                category = "미술";
                break;
            case 영화 :
                category = "영화";
                break;
            case 독서 :
                category = "독서";
                break;
                case 대화 :
                category = "대화";
                break;
        }

        if(category.isEmpty()) return null;

        // 방 등록
        Consultation consultation = Consultation.builder()
                .category(category)
                .title(registRoomRequest.getTitle())
                .isPrivated(registRoomRequest.getIsPrivated())
                .password(registRoomRequest.getPassword())
                .startTime(registRoomRequest.getStartTime())
                .endTime(registRoomRequest.getEndTime())
                .sessionId(registRoomRequest.getSessionId())
                .build();

        Consultation newConsultation;

        try {
            newConsultation = consultationRepository.save(consultation);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback" + e.getMessage());
        }

        return RegistRoomResponse.builder()
                .id(newConsultation.getId())
                .startTime(newConsultation.getStartTime())
                .isPrivated(newConsultation.getIsPrivated())
                .password(newConsultation.getPassword())
                .sessionId(newConsultation.getSessionId())
                .build();
    }

    // 방 리스트에서 참가
    @Transactional
    public JoinRoomResponse joinRoom(JoinRoomRequest joinRoomRequest) {
        Member m = Member.builder().id(joinRoomRequest.getMemberId()).build();
        Consultation c = Consultation.builder().id(joinRoomRequest.getId()).build();

        // 당일 집단 상담 이용했는지 확인
        Optional<Participant> isUsed = participantRepository.findByMemberIdAndConsultationDate(m, LocalDate.now());

        if(isUsed.isPresent()) return null;

        Participant newParticipant = Participant.builder()
                .memberId(m)
                .memberNickname(joinRoomRequest.getMemberNickname())
                .consultationId(c)
                .consultationDate(joinRoomRequest.getConsultationDate())
                .build();

        Optional<Consultation> consultation = consultationRepository.findById(joinRoomRequest.getId());

        if(consultation.isEmpty()) return null;

        if(consultation.get().getCurrentParticipants() >= 5) return null;

        // 비밀번호 확인
        if(consultation.get().getIsPrivated()) {
            if(!consultation.get().getPassword().equals(joinRoomRequest.getPassword())) return null;
        }

        Participant participant;

        try {
            participant = participantRepository.save(newParticipant);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        // 방 현재 참가자 수 수정
        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() + 1);

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        Optional<Member> member = memberRepository.findById(newParticipant.getMemberId().getId());

        if(member.isEmpty()) return null;

        return JoinRoomResponse.builder()
                .consultationId(consultation.get().getId())
                .id(participant.getId())
                .memberId(member.get().getId())
                .memberNickname(member.get().getNickname())
                .profileUrl(member.get().getProfileUrl())
                .build();
    }

    public Map<String, Object> findRandomSessionId(JoinRandomRequest joinRandomRequest) {
        Member m = Member.builder().id(joinRandomRequest.getMemberId()).build();

        // 당일 집단 상담 이용했는지 확인
        Optional<Participant> isUsed = participantRepository.findByMemberIdAndConsultationDate(m, LocalDate.now());

        if(isUsed.isPresent()) return null;

        List<Participant> p = participantRepository.findByMemberId(m);

        List<Long> c = new ArrayList<>();

        for(Participant p1 : p) {
            c.add(p1.getConsultationId().getId());
        }

        SearchCondition type = joinRandomRequest.getType();
        Optional<Consultation> consultation;

        if(type == null || type == SearchCondition.전체 ) consultation = consultationRepository.findByCurrentParticipantsLessThanEqualOrderByRand(4, c);

        else if(type != SearchCondition.비밀방 && type != SearchCondition.요약) consultation = consultationRepository.findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(type.name(), 4, c);

        else return null;

        if(consultation.isEmpty()) return null;

        Map<String, Object> map = new HashMap<>();
        map.put("id", consultation.get().getId());
        map.put("sessionId", consultation.get().getSessionId());
        map.put("consultationDate", consultation.get().getStartTime());

        return map;
    }

    // 랜덤 방 조회 (조건: 사용자가 선택한 카테고리, 현재 참여 인원이 5 미만인 곳
    @Transactional
    public JoinRandomResponse joinRandom(JoinRandomRequest joinRandomRequest) {
        Optional<Consultation> consultation = consultationRepository.findById(joinRandomRequest.getId());

        if(consultation.isEmpty()) return null;

        Member m = Member.builder().id(joinRandomRequest.getMemberId()).build();

        Participant newParticipant = Participant.builder()
                .memberId(m)
                .memberNickname(joinRandomRequest.getMemberNickname())
                .consultationId(consultation.get())
                .consultationDate(joinRandomRequest.getConsultationDate())
                .build();

        Participant participant;

        try {
            participant = participantRepository.save(newParticipant);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        // 다시 해당 상담방 update
        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants()+1);

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        Optional<Member> member = memberRepository.findById(newParticipant.getMemberId().getId());

        if(member.isEmpty()) return null;

        return JoinRandomResponse.builder()
                .consultationId(consultation.get().getId())
                .id(participant.getId())
                .memberId(member.get().getId())
                .memberNickname(member.get().getNickname())
                .profileUrl(member.get().getProfileUrl())
                .build();
    }

    // 회의 시작 전 퇴장
    @Transactional
    public int exitRoomBeforeStart(ExitRoomBeforeStartRequest exitRoomBeforeStartRequest) {
        Member m = Member.builder().id(exitRoomBeforeStartRequest.getMemberId()).build();
        Consultation c = Consultation.builder().id(exitRoomBeforeStartRequest.getConsultationId()).build();

        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(m, c);

        if(participant.isEmpty()) return 0;

        try {
            participantRepository.delete(participant.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        Optional<Consultation> consultation = consultationRepository.findById(exitRoomBeforeStartRequest.getConsultationId());

        if(consultation.isEmpty()) return 0;

        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() - 1);

        if(consultation.get().getCurrentParticipants() == 0) {
            try {
                consultationRepository.delete(consultation.get());
            } catch (RuntimeException e) {
                throw new RuntimeException("db 오류 rollback");
            }

            return 1;
        }

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        return 1;
    }

    // 회의 시작 후 퇴장
    public int exitRoomAfterStart(ExitRoomAfterStartRequest exitRoomAfterStartRequest) {
        Member m = Member.builder().id(exitRoomAfterStartRequest.getMemberId()).build();
        Consultation c = Consultation.builder().id(exitRoomAfterStartRequest.getConsultationId()).build();

        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(m, c);

        if(participant.isEmpty()) return 0;

        Optional<Consultation> consultation = consultationRepository.findById(exitRoomAfterStartRequest.getConsultationId());

        if(consultation.isEmpty()) return 0;

        consultation.get().setCurrentParticipants(consultation.get().getCurrentParticipants() - 1);

        if(consultation.get().getCurrentParticipants() == 0) consultation.get().setSessionId(null);

        try {
            consultationRepository.save(consultation.get());
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        return 1;
    }

    // 채팅 조회
    public List<FindChattingResponse> findChatting(Long consultationId) {
        Consultation c = Consultation.builder().id(consultationId).build();

        List<ChattingLog> chattingLog = chattingLogRepository.findByConsultationId(c);

        return chattingLog.stream()
                .map(chatting -> FindChattingResponse.builder()
                        .id(chatting.getId())
                        .content(chatting.getContent())
                        .memberId(chatting.getMemberId().getId())
                        .memberNickname(chatting.getMemberNickname())
                        .sendTime(chatting.getSendTime())
                        .consultationId(chatting.getConsultationId().getId())
                        .build()
                )
                .collect(Collectors.toList());
    }

    // 채팅 등록
    public int registChatting(RegistChattingRequest registChattingRequest) {
        Member m = Member.builder().id(registChattingRequest.getMemberId()).build();
        Consultation c = Consultation.builder().id(registChattingRequest.getConsultationId()).build();

        Optional<Participant> participant = participantRepository.findByMemberIdAndConsultationId(m, c);

        if(participant.isEmpty()) return 0;

        ChattingLog chattingLog = ChattingLog.builder()
                .consultationId(c)
                .memberId(m)
                .memberNickname(registChattingRequest.getMemberNickname())
                .content(registChattingRequest.getContent())
                .build();

        try {
            chattingLogRepository.save(chattingLog);
        } catch (RuntimeException e) {
            throw new RuntimeException("db 오류 rollback");
        }

        return 1;
    }

    // 쪽지 보낼 수 있는 명단 조회
    public List<RecentParticipantResponse> findRecentParticipants(Long memberId) {
        Member m = Member.builder().id(memberId).build();

        List<Participant> participantList = participantRepository.findByMemberId(m);

        List<Consultation> consultationIdList = new ArrayList<>();

        for(Participant participant : participantList) {
            Consultation c = Consultation.builder().id(participant.getConsultationId().getId()).build();
            consultationIdList.add(c);
        }

        List<Member> memberIdList = new ArrayList<>();
        memberIdList.add(m);

        List<Participant> participants = participantRepository.findByConsultationIdInAndMemberIdNotIn(consultationIdList, memberIdList);

        return participants.stream()
                .map(domain -> new RecentParticipantResponse(
                        domain.getId(),
                        domain.getMemberId().getId(),
                        domain.getMemberNickname(),
                        domain.getConsultationId().getId(),
                        domain.getConsultationDate()
                ))
                .toList();
    }

    // 진행중 상담 재입장 기능
    public OngoingRoomResponse findOngoingRoom(Long memberId) {
        Member m = Member.builder().id(memberId).build();

        Optional<Participant> p = participantRepository.findByMemberIdAndConsultationDate(m, LocalDate.now());

        if(p.isEmpty()) return null;

        Optional<Consultation> c = consultationRepository.findById(p.get().getConsultationId().getId());

        if(c.isEmpty()) return null;

        Optional<Consultation> consultation = consultationRepository.findByIdAndCurrentTimeBetween(c.get().getId(), c.get().getStartTime(), c.get().getEndTime());

        if(consultation.isEmpty()) return null;

        Optional<Member> member = memberRepository.findById(memberId);

        return OngoingRoomResponse.builder()
                .consultationId(consultation.get().getId())
                .sessionId(consultation.get().getSessionId())
                .id(p.get().getId())
                .memberId(p.get().getMemberId().getId())
                .memberNickname(p.get().getMemberNickname())
                .profileUrl(member.get().getProfileUrl())
                .build();

    }

    // 상세 조회
    public ConsultationDetailResponse findConsultationDetail(Long id, Long memberId) {
        Optional<Consultation> consultation = consultationRepository.findById(id);

        if(consultation.isEmpty()) return null;

        if(consultation.get().getStartTime().isAfter(LocalDateTime.now())) return null;

        Member m = Member.builder().id(memberId).build();

        Optional<Participant> p = participantRepository.findByMemberIdAndConsultationId(m, consultation.get());

        if(p.isEmpty()) return null;

        // 참가자 리스트 조회
        List<Participant> list = participantRepository.findByConsultationId(consultation.get());

        List<ParticipantResponse> pList = list.stream().map(participant -> {
            Member member = memberRepository.findById(participant.getMemberId().getId())
                    .orElseThrow(() -> new RuntimeException("Member not found"));

            return ParticipantResponse.builder()
                    .id(participant.getId())
                    .memberId(participant.getMemberId().getId())
                    .memberNickname(participant.getMemberNickname())
                    .consultationId(participant.getConsultationId().getId())
                    .consultationDate(participant.getConsultationDate())
                    .profileUrl(member.getProfileUrl())
                    .build();
        }).collect(Collectors.toList());

        return ConsultationDetailResponse.builder()
                .id(consultation.get().getId())
                .category(consultation.get().getCategory())
                .title(consultation.get().getTitle())
                .isPrivated(consultation.get().getIsPrivated())
                .password(consultation.get().getPassword())
                .startTime(consultation.get().getStartTime())
                .endTime(consultation.get().getEndTime())
                .currentParticipants(consultation.get().getCurrentParticipants())
                .participants(pList)
                .build();
    }
}
