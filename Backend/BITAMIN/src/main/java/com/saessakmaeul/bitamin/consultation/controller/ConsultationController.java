package com.saessakmaeul.bitamin.consultation.controller;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import com.saessakmaeul.bitamin.consultation.dto.request.*;
import com.saessakmaeul.bitamin.consultation.dto.response.*;
import com.saessakmaeul.bitamin.consultation.service.ConsultationService;
import com.saessakmaeul.bitamin.consultation.service.GptService;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import io.openvidu.java.client.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/consultations")
@RequiredArgsConstructor
public class ConsultationController {
    private final OpenVidu openVidu;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ConsultationService consultationService;
    private final GptService GptService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> selectAll(@RequestParam(value = "page", defaultValue = "0") int page,
                                       @RequestParam(value = "size", defaultValue = "100") int size,
                                       @RequestParam(value = "type", defaultValue = "전체") SearchCondition type) {
        SelectAllResponse consultationList = consultationService.selectAll(page, size, type);

        if(consultationList == null) return ResponseEntity.status(404).body("다시 조회하세요");

        return ResponseEntity.ok(consultationList);
    }

    @PostMapping
    public ResponseEntity<?> registRoom(@RequestBody RegistRoomRequest registRoomRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String,Object> params = new HashMap<>();

        params.put("customSessionId", UUID.randomUUID().toString());

        SessionProperties properties = SessionProperties.fromJson(params).build();

        Session session = openVidu.createSession(properties);

        registRoomRequest.setSessionId(session.getSessionId());

        RegistRoomResponse registRoomResponse = consultationService.registRoom(registRoomRequest);

        if(registRoomResponse == null) return ResponseEntity.status(404).body("방이 생성되지 않았습니다.");

        return ResponseEntity.status(201).body(registRoomResponse);

    }

    @PostMapping("/participants")
    public ResponseEntity<?> joinRoom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                      @RequestBody JoinRoomRequest joinRoomRequest) throws OpenViduJavaClientException, OpenViduHttpException {
        openVidu.fetch();

        Map<String,Object> params = new HashMap<>();

        // 상담 시작 시간이 지났는지 아닌지 확인
        if(joinRoomRequest.getStartTime().isBefore(LocalDateTime.now())) return ResponseEntity.status(404).body("입장 가능 시간이 아닙니다.");

        // 입장 가능한 세션인지 확인
        Session session = openVidu.getActiveSession(joinRoomRequest.getSessionId());
        
        if(session == null) return ResponseEntity.status(404).body("유효하지 않은 세션입니다.");
        
        // DB에 저장
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        joinRoomRequest.setMemberId(memberId);
        joinRoomRequest.setMemberNickname(memberNickname);
        joinRoomRequest.setConsultationDate(joinRoomRequest.getStartTime().toLocalDate());

        JoinRoomResponse joinRoomResponse = consultationService.joinRoom(joinRoomRequest);

        if(joinRoomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        // connection 생성
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        joinRoomResponse.setToken(connection.getToken());

        joinRoomResponse.setSessionId(joinRoomRequest.getSessionId());

        return ResponseEntity.status(200).body(joinRoomResponse);
    }

    @PostMapping("/random-participants")
    public ResponseEntity<?> joinRandom(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                        @RequestBody JoinRandomRequest joinRandomRequest) throws OpenViduJavaClientException, OpenViduHttpException{
        openVidu.fetch();

        Map<String,Object> params = new HashMap<>();

        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        joinRandomRequest.setMemberId(memberId);
        joinRandomRequest.setMemberNickname(memberNickname);

        Map<String, Object> map = consultationService.findRandomSessionId(joinRandomRequest);

        if(map == null) return ResponseEntity.status(404).body("입장 가능한 방이 없습니다.");

        joinRandomRequest.setSessionId(map.get("sessionId").toString());
        joinRandomRequest.setId(Long.parseLong(map.get("id").toString()));
        joinRandomRequest.setConsultationDate(((LocalDateTime)map.get("consultationDate")).toLocalDate());

        System.out.println(joinRandomRequest.getId());


        // 입장 가능한 세션인지 확인
        Session session = openVidu.getActiveSession(joinRandomRequest.getSessionId());

        if (session == null) return ResponseEntity.status(404).body("유효하지 않은 세션입니다.");

        // DB에 저장
        JoinRandomResponse joinRandomResponse = consultationService.joinRandom(joinRandomRequest);

        if(joinRandomResponse == null) return ResponseEntity.status(404).body("방에 참여되지 않았습니다.");

        // connection 생성
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        joinRandomResponse.setToken(connection.getToken());

        joinRandomResponse.setSessionId(joinRandomRequest.getSessionId());
        return ResponseEntity.status(200).body(joinRandomResponse);
    }

    @DeleteMapping("{consultationId}")
    public ResponseEntity<?> ExitRoomBeforeStart(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                 @PathVariable("consultationId") Long consultationId) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        ExitRoomBeforeStartRequest exitRoomBeforeStartRequest = new ExitRoomBeforeStartRequest(memberId, consultationId);

        int result = consultationService.exitRoomBeforeStart(exitRoomBeforeStartRequest);

        if(result == 0) return ResponseEntity.status(404).body("퇴장하지 못했습니다.");

        return ResponseEntity.status(200).body("정상적으로 퇴장 처리 되었습니다.");
    }

    @PatchMapping
    public ResponseEntity<?> ExitRoomAfterStart(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                @RequestBody ExitRoomAfterStartRequest exitRoomAfterStartRequest) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        exitRoomAfterStartRequest.setMemberId(memberId);

        int result = consultationService.exitRoomAfterStart(exitRoomAfterStartRequest);

        if(result == 0) return ResponseEntity.status(404).body("퇴장하지 못했습니다.");

        return ResponseEntity.status(200).body("정상적으로 퇴장 처리 되었습니다.");
    }

    @GetMapping("/chattings/{consultationId}")
    public ResponseEntity<?> findChatting(@PathVariable("consultationId") Long consultationId) {
        List<FindChattingResponse> chattingList = consultationService.findChatting(consultationId);

        return ResponseEntity.status(200).body(chattingList);
    }

    @PostMapping("/chattings")
    public ResponseEntity<?> registChatting(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                           @RequestBody RegistChattingRequest registChattingRequest) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));
        String memberNickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        registChattingRequest.setMemberId(memberId);
        registChattingRequest.setMemberNickname(memberNickname);

        int result = consultationService.registChatting(registChattingRequest);

        if(result == 0) return ResponseEntity.status(404).body("채팅이 저장되지 않았습니다.");

        return ResponseEntity.status(200).body("정상적으로 채팅이 저장되었습니다.");
    }

    @PostMapping("/moderators/{category}/{consultationId}")
    public ResponseEntity<?> selectPrompt(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                          @PathVariable("category") SearchCondition category,
                                          @PathVariable("consultationId") Long consultationId,
                                          @RequestBody GptCompletionRequest gptCompletions) throws OpenViduJavaClientException, OpenViduHttpException {
        String nickname = jwtUtil.extractNickname(tokenHeader.substring(7));

        GptResponseList gptResponses = new GptResponseList();

        Map<String, GptResponse> map = new HashMap<>();

        for(String str : gptCompletions.getGptCompletions().keySet()) {
            GptCompletion gptCompletion = gptCompletions.getGptCompletions().get(str);

            System.out.println("param :: " + gptCompletion.toString());

            GptResponse gptResponse = GptService.prompt(category, nickname, gptCompletion);

            map.put(str, gptResponse);
        }

        gptResponses.setGptResponses(map);

        if(category != SearchCondition.요약) {
            String data = gptResponses.getGptResponses().get(jwtUtil.extractNickname(tokenHeader.substring(7))).getContent();
            System.out.println(data + " " + consultationId);
            // 구독된 상담방으로 broadcast
            simpMessagingTemplate.convertAndSend("/sub/consultations/" + consultationId, data);
        }

        return ResponseEntity.status(200).body(gptResponses);
    }

    @GetMapping("/recent-participants")
    public ResponseEntity<?> findRecentParticipants(@RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        List<RecentParticipantResponse> participantList = consultationService.findRecentParticipants(memberId);

        return ResponseEntity.status(200).body(participantList);
    }

    @GetMapping("/ongoing")
    public ResponseEntity<?> findOngoingRoom(@RequestHeader(value = "Authorization", required = false) String tokenHeader) throws OpenViduJavaClientException, OpenViduHttpException {
        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        OngoingRoomResponse ongoingRoomResponse = consultationService.findOngoingRoom(memberId);

        Session session = openVidu.getActiveSession(ongoingRoomResponse.getSessionId());

        if (session == null) return ResponseEntity.status(404).body("유효하지 않은 세션입니다.");

        Map<String,Object> params = new HashMap<>();

        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        Connection connection = session.createConnection(properties);

        ongoingRoomResponse.setToken(connection.getToken());

        return ResponseEntity.status(200).body(ongoingRoomResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> findConsultationDetail(@RequestHeader(value = "Authorization", required = false) String tokenHeader,
                                                @PathVariable("id") Long id) {

        Long memberId = jwtUtil.extractUserId(tokenHeader.substring(7));

        ConsultationDetailResponse consultationDetailResponse = consultationService.findConsultationDetail(id, memberId);

        if(consultationDetailResponse == null) return ResponseEntity.status(404).body("올바르지 않은 접근입니다.");

        return ResponseEntity.status(200).body(consultationDetailResponse);
    }
}
