package com.saessakmaeul.bitamin.consultation;

import com.saessakmaeul.bitamin.consultation.Entity.Consultation;
import com.saessakmaeul.bitamin.consultation.Entity.Participant;
import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.*;
import com.saessakmaeul.bitamin.consultation.dto.response.*;
import com.saessakmaeul.bitamin.consultation.repository.ConsultationRepository;
import com.saessakmaeul.bitamin.consultation.repository.ParticipantRepository;
import com.saessakmaeul.bitamin.consultation.service.ConsultationService;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ConsultationServiceTest {
    @Mock
    private ConsultationRepository consultationRepository;

    @Mock
    private ParticipantRepository participantRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private ConsultationService consultationService;

    // 멤버 생성
    /*
    * 1. member1
    * 2. member2
    * */
    private Member member1;
    private Member member2;

    // 기존 방 생성
    /*
    * 1. 음악
    * 2. 미술
    * 3. 영화
    * 4. 독서
    * 5. 대화
    * */
    private Consultation music;
    private Consultation art;
    private Consultation movie;
    private Consultation reading;
    private Consultation conversation;
    private Consultation privated;

    private Participant readingParticipant;
    private Participant conversationParticipant1;
    private Participant conversationParticipant2;

    @BeforeEach // 테스트 전 처리 (시작 시)
    public void before() {
        member1 = Member.builder()
                .id(1L)
                .email("user1@user")
                .password("password")
                .name("user1")
                .nickname("user1")
                .dongCode("1111010200")
                .birthday(LocalDate.of(1999, 3, 27))
                .role(Role.ROLE_MEMBER)
                .profileUrl("asdas")
                .build();

        member2 = Member.builder()
                .id(2L)
                .email("user2@user")
                .password("password")
                .name("user2")
                .nickname("user2")
                .dongCode("1111010200")
                .birthday(LocalDate.of(2000, 8, 7))
                .role(Role.ROLE_MEMBER)
                .profileUrl("asdasss")
                .build();

        music = Consultation.builder()
                .id(1L)
                .category("음악")
                .title("음악 함께 들어요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("1")
                .build();

        art = Consultation.builder()
                .id(2L)
                .category("미술")
                .title("그림 함께 그려요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("2")
                .build();

        movie = Consultation.builder()
                .id(3L)
                .category("영화")
                .title("영화 함께 보아요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("3")
                .build();

        reading = Consultation.builder()
                .id(4L)
                .category("독서")
                .title("책 함께 읽어요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(1)
                .sessionId("4")
                .build();

        conversation = Consultation.builder()
                .id(5L)
                .category("대화")
                .title("대화 함께 해봐요")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("5")
                .build();

        privated = Consultation.builder()
                .id(6L)
                .category("음악")
                .title("음악 듣자")
                .isPrivated(true)
                .password("1234")
                .startTime(LocalDateTime.of(2024, 8, 1, 13, 0, 0))
                .endTime(LocalDateTime.of(2024, 8, 1, 15, 0, 0))
                .currentParticipants(0)
                .sessionId("6")
                .build();

        readingParticipant = Participant.builder()
                .id(1L)
                .consultationId(reading)
                .memberId(member1)
                .memberNickname("user1")
                .consultationDate(LocalDate.of(2024, 8, 1))
                .build();

        conversationParticipant1 = Participant.builder()
                .id(2L)
                .consultationId(conversation)
                .memberId(member1)
                .memberNickname("user1")
                .consultationDate(LocalDate.of(2024, 8, 1))
                .build();

        conversationParticipant2 = Participant.builder()
                .id(3L)
                .consultationId(conversation)
                .memberId(member2)
                .memberNickname("user2")
                .consultationDate(LocalDate.of(2024, 8, 1))
                .build();

        System.out.println("Test start");
    }

    @AfterEach // 테스트 후 처리 (종료 시)
    public void after() {
        System.out.println("Test end");
    }

    // 상담방 전체 조회
    /*
    * 1. 전체 조회
    * 2. 카테고리별 조회 5개
    * 3. 비밀방만 조회
    * */
    @Test
    @DisplayName("전체 조회에 대한 테스트")
    public void selectAll() throws Exception {
        // Given
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        SearchCondition type = SearchCondition.전체;

        List<Consultation> consultationList = Arrays.asList(privated, conversation, reading, movie, art, music);
        Page<Consultation> consultationPage = new PageImpl<>(consultationList, pageable, consultationList.size());
        List<ConsultationListResponse> list = Arrays.asList(
                new ConsultationListResponse(privated.getId(), privated.getCategory(), privated.getTitle(), privated.getIsPrivated(), privated.getStartTime(), privated.getEndTime(), privated.getCurrentParticipants(), privated.getSessionId()),
                new ConsultationListResponse(conversation.getId(), conversation.getCategory(), conversation.getTitle(), conversation.getIsPrivated(), conversation.getStartTime(), conversation.getEndTime(), conversation.getCurrentParticipants(), conversation.getSessionId()),
                new ConsultationListResponse(reading.getId(), reading.getCategory(), reading.getTitle(), reading.getIsPrivated(), reading.getStartTime(), reading.getEndTime(), reading.getCurrentParticipants(), reading.getSessionId()),
                new ConsultationListResponse(movie.getId(), movie.getCategory(), movie.getTitle(), movie.getIsPrivated(), movie.getStartTime(), movie.getEndTime(), movie.getCurrentParticipants(), movie.getSessionId()),
                new ConsultationListResponse(art.getId(), art.getCategory(), art.getTitle(), art.getIsPrivated(), art.getStartTime(), art.getEndTime(), art.getCurrentParticipants(), art.getSessionId()),
                new ConsultationListResponse(music.getId(), music.getCategory(), music.getTitle(), music.getIsPrivated(), music.getStartTime(), music.getEndTime(), music.getCurrentParticipants(), music.getSessionId())
        );

        // When
        when(consultationRepository.findBySessionIdIsNotNullAndCurrentParticipantsBetween(1, 4, pageable))
                .thenReturn(consultationPage);

        SelectAllResponse expected = SelectAllResponse.builder()
                .consultationList(list)
                .page(0)
                .size(100)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

        // Then
        SelectAllResponse actual = consultationService.selectAll(0, 100, type);

        assertEquals(expected, actual);
        System.out.println("전체 조회 성공");
    }

    @Test
    @DisplayName("카테고리 별 조회에 대한 테스트")
    public void selectAllByCategory() throws Exception {
        // Given
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        SearchCondition type = SearchCondition.음악;

        List<Consultation> consultationList = Arrays.asList(privated, music);
        Page<Consultation> consultationPage = new PageImpl<>(consultationList, pageable, consultationList.size());
        List<ConsultationListResponse> list = Arrays.asList(
                new ConsultationListResponse(privated.getId(), privated.getCategory(), privated.getTitle(), privated.getIsPrivated(), privated.getStartTime(), privated.getEndTime(), privated.getCurrentParticipants(), privated.getSessionId()),
                new ConsultationListResponse(music.getId(), music.getCategory(), music.getTitle(), music.getIsPrivated(), music.getStartTime(), music.getEndTime(), music.getCurrentParticipants(), music.getSessionId())
        );

        // When
        when(consultationRepository.findByCategoryAndSessionIdIsNotNullAndCurrentParticipantsBetween(type.name(), 1, 4, pageable))
                .thenReturn(consultationPage);

        SelectAllResponse expected = SelectAllResponse.builder()
                .consultationList(list)
                .page(0)
                .size(100)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

        // Then
        SelectAllResponse actual = consultationService.selectAll(0, 100, type);

        assertEquals(expected, actual);
        System.out.println("음악 성공");
    }

    @Test
    @DisplayName("비밀방 조회에 대한 테스트")
    public void selectAllByPrivated() throws Exception {
        // Given
        Pageable pageable = PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "id"));
        SearchCondition type = SearchCondition.비밀방;

        List<Consultation> consultationList = Arrays.asList(privated);
        Page<Consultation> consultationPage = new PageImpl<>(consultationList, pageable, consultationList.size());
        List<ConsultationListResponse> list = Arrays.asList(
                new ConsultationListResponse(privated.getId(), privated.getCategory(), privated.getTitle(), privated.getIsPrivated(), privated.getStartTime(), privated.getEndTime(), privated.getCurrentParticipants(), privated.getSessionId())
        );

        // When
        when(consultationRepository.findByIsPrivatedAndSessionIdIsNotNullAndCurrentParticipantsBetween(true,1,  4, pageable))
                .thenReturn(consultationPage);

        SelectAllResponse expected = SelectAllResponse.builder()
                .consultationList(list)
                .page(0)
                .size(100)
                .totalElements(consultationPage.getTotalElements())
                .totalPages(consultationPage.getTotalPages())
                .build();

        // Then
        SelectAllResponse actual = consultationService.selectAll(0, 100, type);

        assertEquals(expected, actual);
        System.out.println("비밀방 조회 성공");
    }

    @Test
    @DisplayName("상담 방 생성에 대한 테스트")
    public void registRoom() throws Exception {
        // Given
        RegistRoomRequest registRoomRequest = RegistRoomRequest.builder()
                .category(SearchCondition.미술)
                .title("서로 얼굴 그려주기 해요~~")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 2, 9, 30, 0))
                .endTime(LocalDateTime.of(2024, 8, 2, 11, 30, 0))
                .sessionId("7")
                .build();

        Consultation consultation = Consultation.builder()
                .id(7L)
                .category("미술")
                .title("서로 얼굴 그려주기 해요~~")
                .isPrivated(false)
                .password(null)
                .startTime(LocalDateTime.of(2024, 8, 2, 9, 30, 0))
                .endTime(LocalDateTime.of(2024, 8, 2, 11, 30, 0))
                .sessionId("7")
                .build();

        // When
        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        RegistRoomResponse expected = RegistRoomResponse.builder()
                .id(consultation.getId())
                .isPrivated(consultation.getIsPrivated())
                .password(consultation.getPassword())
                .startTime(consultation.getStartTime())
                .sessionId(consultation.getSessionId())
                .build();

        // Then
        RegistRoomResponse actual = consultationService.registRoom(registRoomRequest);

        assertEquals(expected, actual);
        System.out.println("상담 방 생성 성공");
    }

    @Test
    @DisplayName("상담 방 참여에 대한 테스트")
    public void join() throws Exception {
        //Given
        JoinRoomRequest joinRoomRequest = JoinRoomRequest.builder()
                .id(music.getId())
                .isPrivated(music.getIsPrivated())
                .password(music.getPassword())
                .startTime(music.getStartTime())
                .sessionId(music.getSessionId())
                .consultationDate(music.getStartTime().toLocalDate())
                .memberId(member1.getId())
                .memberNickname(member1.getNickname())
                .build();

        Participant participant = Participant.builder()
                .consultationId(music)
                .consultationDate(music.getStartTime().toLocalDate())
                .memberId(member1)
                .memberNickname(member1.getNickname())
                .build();

        Consultation consultation = Consultation.builder()
                .id(music.getId())
                .category(music.getCategory())
                .title(music.getTitle())
                .isPrivated(music.getIsPrivated())
                .password(music.getPassword())
                .startTime(music.getStartTime())
                .endTime(music.getEndTime())
                .sessionId(music.getSessionId())
                .currentParticipants(music.getCurrentParticipants())
                .build();

        Member member = Member.builder()
                .id(member1.getId())
                .nickname(member1.getNickname())
                .profileUrl(member1.getProfileUrl())
                .build();

        // When
        when(consultationRepository.findById(music.getId())).thenReturn(Optional.of(consultation));

        when(participantRepository.save(any(Participant.class))).thenReturn(participant);

        consultation.setCurrentParticipants(consultation.getCurrentParticipants() + 1);

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        when(memberRepository.findById(member.getId())).thenReturn(Optional.of(member));


        JoinRoomResponse expected = JoinRoomResponse.builder()
                .consultationId(music.getId())
                .memberId(member1.getId())
                .memberNickname(member1.getNickname())
                .profileUrl(member1.getProfileUrl())
                .build();

        // Then
        JoinRoomResponse actual = consultationService.joinRoom(joinRoomRequest);

        assertEquals(expected, actual);
        System.out.println("상담 방 참여 성공");
    }

    @Test
    @DisplayName("랜덤 참여 조회 테스트")
    public void  findRandomSessionId() throws Exception {
        // Given
        JoinRandomRequest joinRandomRequest = JoinRandomRequest.builder()
                .type(SearchCondition.영화)
                .memberId(member1.getId())
                .build();

        Consultation consultation = Consultation.builder()
                .id(movie.getId())
                .sessionId(movie.getSessionId())
                .startTime(movie.getStartTime())
                .build();

        Member member = Member.builder().id(member1.getId()).build();

        List<Participant> participants = new ArrayList<>();
        List<Long> consultationIds = new ArrayList<>();

        // When
        when(participantRepository.findByMemberId(any(Member.class))).thenReturn(participants);

        for(Participant p : participants) {
            consultationIds.add(p.getConsultationId().getId());
        }

        when(consultationRepository.findByCategoryAndCurrentParticipantsLessThanEqualOrderByRand(SearchCondition.영화.name(), 4, consultationIds))
                .thenReturn(Optional.of(consultation));

        Map<String, Object> expected = new HashMap<>();
        expected.put("id", consultation.getId());
        expected.put("sessionId", consultation.getSessionId());
        expected.put("consultationDate", consultation.getStartTime());

        // Then
       Map<String, Object> actual = consultationService.findRandomSessionId(joinRandomRequest);

       assertEquals(expected, actual);
       System.out.println("랜덤 방 조회 성공");
    }

    @Test
    @DisplayName("랜덤 조회 후 방 참여 테스트")
    public void joinRandom() throws Exception {
        // Given
        JoinRandomRequest joinRandomRequest = JoinRandomRequest.builder()
                .id(movie.getId())
                .sessionId(movie.getSessionId())
                .memberId(member1.getId())
                .memberNickname(member1.getNickname())
                .consultationDate(movie.getStartTime().toLocalDate())
                .build();

        Participant participant = Participant.builder()
                .consultationId(movie)
                .consultationDate(movie.getStartTime().toLocalDate())
                .memberId(member1)
                .memberNickname(member1.getNickname())
                .build();

        Consultation consultation = Consultation.builder()
                .id(movie.getId())
                .category(movie.getCategory())
                .title(movie.getTitle())
                .isPrivated(movie.getIsPrivated())
                .password(movie.getPassword())
                .startTime(movie.getStartTime())
                .endTime(movie.getEndTime())
                .sessionId(movie.getSessionId())
                .currentParticipants(movie.getCurrentParticipants())
                .build();

        Member member = Member.builder()
                .id(member1.getId())
                .nickname(member1.getNickname())
                .profileUrl(member1.getProfileUrl())
                .build();

        // When
        when(consultationRepository.findById(movie.getId())).thenReturn(Optional.of(consultation));

        when(participantRepository.save(any(Participant.class))).thenReturn(participant);

        consultation.setCurrentParticipants(consultation.getCurrentParticipants() + 1);

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        when(memberRepository.findById(member.getId())).thenReturn(Optional.of(member));

        JoinRandomResponse expected = JoinRandomResponse.builder()
                .consultationId(consultation.getId())
                .id(participant.getId())
                .memberId(member.getId())
                .memberNickname(member.getNickname())
                .profileUrl(member.getProfileUrl())
                .build();

        // Then
        JoinRandomResponse actual = consultationService.joinRandom(joinRandomRequest);

        assertEquals(expected, actual);
        System.out.println("랜덤 방 참여 성공");
    }

    @Test
    @DisplayName("상담 시작 전 퇴장 - 방 삭제 테스트")
    public void exitRoomBeforeStart1() throws Exception {
        // Given
        ExitRoomBeforeStartRequest exitRoomBeforeStartRequest = ExitRoomBeforeStartRequest.builder()
                .memberId(member1.getId())
                .consultationId(reading.getId())
                .build();

        Participant participant = Participant.builder()
                .id(readingParticipant.getId())
                .memberId(member1)
                .memberNickname(readingParticipant.getMemberNickname())
                .consultationId(readingParticipant.getConsultationId())
                .consultationDate(readingParticipant.getConsultationDate())
                .build();

        Consultation consultation = Consultation.builder()
                .id(reading.getId())
                .category(reading.getCategory())
                .title(reading.getTitle())
                .isPrivated(reading.getIsPrivated())
                .password(reading.getPassword())
                .startTime(reading.getStartTime())
                .endTime(reading.getEndTime())
                .currentParticipants(reading.getCurrentParticipants())
                .sessionId(reading.getSessionId())
                .build();

        Member member = Member.builder().id(member1.getId()).build();

        // When
        when(participantRepository.findByMemberIdAndConsultationId(any(Member.class), any(Consultation.class))).thenReturn(Optional.of(participant));
        when(consultationRepository.findById(participant.getConsultationId().getId())).thenReturn(Optional.of(consultation));

        // Then
        int actual = consultationService.exitRoomBeforeStart(exitRoomBeforeStartRequest);

        verify(participantRepository).delete(participant);
        verify(consultationRepository).delete(consultation);

        assertEquals(1, actual);
        System.out.println("방 삭제 성공");
    }

    @Test
    @DisplayName("상담 시작 전 퇴장 - 참여인원 갱신 테스트")
    public void exitRoomBeforeStart2() throws Exception {
        // Given
        ExitRoomBeforeStartRequest exitRoomBeforeStartRequest = ExitRoomBeforeStartRequest.builder()
                .memberId(member1.getId())
                .consultationId(conversation.getId())
                .build();

        Participant participant = Participant.builder()
                .id(conversationParticipant1.getId())
                .memberId(member1)
                .memberNickname(conversationParticipant1.getMemberNickname())
                .consultationId(conversationParticipant1.getConsultationId())
                .consultationDate(conversationParticipant1.getConsultationDate())
                .build();

        Consultation consultation = Consultation.builder()
                .id(conversation.getId())
                .category(conversation.getCategory())
                .title(conversation.getTitle())
                .isPrivated(conversation.getIsPrivated())
                .password(conversation.getPassword())
                .startTime(conversation.getStartTime())
                .endTime(conversation.getEndTime())
                .currentParticipants(conversation.getCurrentParticipants())
                .sessionId(conversation.getSessionId())
                .build();

        Member member = Member.builder().id(member1.getId()).build();

        // When
        when(participantRepository.findByMemberIdAndConsultationId(any(Member.class), any(Consultation.class))).thenReturn(Optional.of(participant));

        when(consultationRepository.findById(conversationParticipant1.getConsultationId().getId())).thenReturn(Optional.of(consultation));

        consultation.setCurrentParticipants(conversation.getCurrentParticipants() - 1);

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        // Then
        int actual = consultationService.exitRoomBeforeStart(exitRoomBeforeStartRequest);

        verify(participantRepository).delete(participant);

        assertEquals(1, actual);
        System.out.println("인원 갱신 성공");
    }

    @Test
    @DisplayName("상담 시작 후 퇴장 - sessionId null 테스트")
    public void exitRoomAfterStart1() throws Exception {
        // Given
        ExitRoomAfterStartRequest exitRoomAfterStartRequest = ExitRoomAfterStartRequest.builder()
                .memberId(member1.getId())
                .consultationId(reading.getId())
                .build();

        Participant participant = Participant.builder()
                .id(readingParticipant.getId())
                .memberId(member1)
                .memberNickname(readingParticipant.getMemberNickname())
                .consultationId(readingParticipant.getConsultationId())
                .consultationDate(readingParticipant.getConsultationDate())
                .build();

        Consultation consultation = Consultation.builder()
                .id(reading.getId())
                .category(reading.getCategory())
                .title(reading.getTitle())
                .isPrivated(reading.getIsPrivated())
                .password(reading.getPassword())
                .startTime(reading.getStartTime())
                .endTime(reading.getEndTime())
                .currentParticipants(reading.getCurrentParticipants())
                .sessionId(reading.getSessionId())
                .build();

        Member member = Member.builder().id(member1.getId()).build();

        // When
        when(participantRepository.findByMemberIdAndConsultationId(any(Member.class), any(Consultation.class))).thenReturn(Optional.of(participant));

        when(consultationRepository.findById(readingParticipant.getConsultationId().getId())).thenReturn(Optional.of(consultation));

        consultation.setCurrentParticipants(reading.getCurrentParticipants() - 1);
        consultation.setSessionId(null);

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        // Then
        int actual = consultationService.exitRoomAfterStart(exitRoomAfterStartRequest);

        assertEquals(1, actual);
        System.out.println("session Id 갱신 성공");
    }

    @Test
    @DisplayName("상담 시작 후 퇴장 - 참여인원 갱신 테스트")
    public void exitRoomAfterStart2() throws Exception {
        // Given
        ExitRoomAfterStartRequest exitRoomAfterStartRequest = ExitRoomAfterStartRequest.builder()
                .memberId(member1.getId())
                .consultationId(conversation.getId())
                .build();

        Participant participant = Participant.builder()
                .id(conversationParticipant1.getId())
                .memberId(member1)
                .memberNickname(conversationParticipant1.getMemberNickname())
                .consultationId(conversationParticipant1.getConsultationId())
                .consultationDate(conversationParticipant1.getConsultationDate())
                .build();

        Consultation consultation = Consultation.builder()
                .id(conversation.getId())
                .category(conversation.getCategory())
                .title(conversation.getTitle())
                .isPrivated(conversation.getIsPrivated())
                .password(conversation.getPassword())
                .startTime(conversation.getStartTime())
                .endTime(conversation.getEndTime())
                .currentParticipants(conversation.getCurrentParticipants())
                .sessionId(conversation.getSessionId())
                .build();

        Member member = Member.builder().id(member1.getId()).build();

        // When
        when(participantRepository.findByMemberIdAndConsultationId(any(Member.class), any(Consultation.class))).thenReturn(Optional.of(participant));

        when(consultationRepository.findById(conversationParticipant1.getConsultationId().getId())).thenReturn(Optional.of(consultation));

        consultation.setCurrentParticipants(conversation.getCurrentParticipants() - 1);

        when(consultationRepository.save(any(Consultation.class))).thenReturn(consultation);

        // Then
        int actual = consultationService.exitRoomAfterStart(exitRoomAfterStartRequest);

        assertEquals(1, actual);
        System.out.println("인원 갱신 성공");
    }

    @Test
    @DisplayName("최근 상담 참여자 리스트 조회 테스트")
    public void findRecentParticipants() throws Exception {
        // Given
        Participant p1 = Participant.builder()
                .id(conversationParticipant1.getId())
                .memberId(member1)
                .memberNickname(conversationParticipant1.getMemberNickname())
                .consultationId(conversationParticipant1.getConsultationId())
                .consultationDate(conversationParticipant1.getConsultationDate())
                .build();

        Participant p2 = Participant.builder()
                .id(conversationParticipant2.getId())
                .memberId(member2)
                .memberNickname(conversationParticipant2.getMemberNickname())
                .consultationId(conversationParticipant2.getConsultationId())
                .consultationDate(conversationParticipant2.getConsultationDate())
                .build();

        Member member = Member.builder().id(member1.getId()).build();

        List<Participant> participantList = Arrays.asList(p1);

        List<Participant> participants = Arrays.asList(p2);

        // When
        when(participantRepository.findByMemberId(any(Member.class))).thenReturn(participantList);

        List<Consultation> consultationIdList = new ArrayList<>();
        for(Participant p : participantList) {
            consultationIdList.add(p.getConsultationId());
        }

        List<Member> memberIdList = new ArrayList<>();
        memberIdList.add(member);

        when(participantRepository.findByConsultationIdInAndMemberIdNotIn(anyList(), anyList())).thenReturn(participants);

        List<RecentParticipantResponse> expected = participants.stream()
                .map(domain -> new RecentParticipantResponse(
                        domain.getId(),
                        domain.getMemberId().getId(),
                        domain.getMemberNickname(),
                        domain.getConsultationId().getId(),
                        domain.getConsultationDate()
                ))
                .toList();

        // Then
        List<RecentParticipantResponse> actual = consultationService.findRecentParticipants(member.getId());

        assertEquals(expected, actual);
        System.out.println("최근 참여자 조회 성공");
    }

    @Test
    @DisplayName("상담 방 상세 조회 테스트")
    public void findConsultationDetail() throws Exception {
        // Given
        Consultation consultation = Consultation.builder()
                .id(conversation.getId())
                .category(conversation.getCategory())
                .title(conversation.getTitle())
                .isPrivated(conversation.getIsPrivated())
                .password(conversation.getPassword())
                .startTime(conversation.getStartTime())
                .endTime(conversation.getEndTime())
                .currentParticipants(conversation.getCurrentParticipants())
                .sessionId(conversation.getSessionId())
                .build();

        Participant p1 = Participant.builder()
                .id(conversationParticipant1.getId())
                .memberId(member1)
                .memberNickname(conversationParticipant1.getMemberNickname())
                .consultationId(conversationParticipant1.getConsultationId())
                .consultationDate(conversationParticipant1.getConsultationDate())
                .build();

        Participant p2 = Participant.builder()
                .id(conversationParticipant2.getId())
                .memberId(member2)
                .memberNickname(conversationParticipant2.getMemberNickname())
                .consultationId(conversationParticipant2.getConsultationId())
                .consultationDate(conversationParticipant2.getConsultationDate())
                .build();

        List<Participant> list = Arrays.asList(p1, p2);

        Member member1D = Member.builder()
                .id(member1.getId())
                .email(member1.getEmail())
                .password(member1.getPassword())
                .name(member1.getName())
                .nickname(member1.getNickname())
                .dongCode(member1.getDongCode())
                .birthday(member1.getBirthday())
                .role(member1.getRole())
                .profileUrl(member1.getProfileUrl())
                .build();

        Member member2D = Member.builder()
                .id(member2.getId())
                .email(member2.getEmail())
                .password(member2.getPassword())
                .name(member2.getName())
                .nickname(member2.getNickname())
                .dongCode(member2.getDongCode())
                .birthday(member2.getBirthday())
                .role(member2.getRole())
                .profileUrl(member2.getProfileUrl())
                .build();

        ParticipantResponse pR1 = ParticipantResponse.builder()
                .id(p1.getId())
                .consultationId(p1.getConsultationId().getId())
                .consultationDate(p1.getConsultationDate())
                .memberId(p1.getMemberId().getId())
                .memberNickname(p1.getMemberNickname())
                .profileUrl(member1D.getProfileUrl())
                .build();

        ParticipantResponse pR2 = ParticipantResponse.builder()
                .id(p2.getId())
                .consultationId(p2.getConsultationId().getId())
                .consultationDate(p2.getConsultationDate())
                .memberId(p2.getMemberId().getId())
                .memberNickname(p2.getMemberNickname())
                .profileUrl(member2D.getProfileUrl())
                .build();

        List<ParticipantResponse> pList = Arrays.asList(pR1, pR2);

        Member m = Member.builder().id(member1.getId()).build();

        // When
        when(consultationRepository.findById(conversation.getId())).thenReturn(Optional.of(consultation));

        when(participantRepository.findByMemberIdAndConsultationId(any(Member.class), any(Consultation.class))).thenReturn(Optional.of(p1));

        when(participantRepository.findByConsultationId(any(Consultation.class))).thenReturn(list);

        when(memberRepository.findById(list.get(0).getMemberId().getId())).thenReturn(Optional.of(member1D));

        when(memberRepository.findById(list.get(1).getMemberId().getId())).thenReturn(Optional.of(member2D));

        ConsultationDetailResponse expect = ConsultationDetailResponse.builder()
                .id(consultation.getId())
                .category(consultation.getCategory())
                .title(consultation.getTitle())
                .isPrivated(consultation.getIsPrivated())
                .password(consultation.getPassword())
                .startTime(consultation.getStartTime())
                .endTime(consultation.getEndTime())
                .currentParticipants(consultation.getCurrentParticipants())
                .participants(pList)
                .build();

        // Then
        ConsultationDetailResponse actual = consultationService.consultationDetail(consultation.getId(), member1.getId());

        assertEquals(expect, actual);
        System.out.println("상세 조회 성공");
    }
}
