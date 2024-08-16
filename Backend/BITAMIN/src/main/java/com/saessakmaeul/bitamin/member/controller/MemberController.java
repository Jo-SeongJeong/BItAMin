package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.member.dto.request.*;
import com.saessakmaeul.bitamin.member.dto.response.*;
import com.saessakmaeul.bitamin.member.repository.DongCodeRepository;
import com.saessakmaeul.bitamin.member.service.MemberService;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;
import org.springframework.context.annotation.Lazy;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/members")
public class MemberController {
    private static final Logger logger = LoggerFactory.getLogger(MemberController.class);
    private static final String BEARER_PREFIX = "Bearer ";
    private final MemberService memberService;
    private final DongCodeRepository dongCodeRepository;
    private final JwtUtil jwtUtil;

    @Value("${KAKAO_API_KEY}")
    private String apiKey;

    public MemberController(@Lazy MemberService memberService, DongCodeRepository dongCodeRepository, JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.dongCodeRepository = dongCodeRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/list")
    public ResponseEntity<List<MemberListResponse>> getMemberList() {
        try {
            List<MemberListResponse> members = memberService.getMemberList();
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            logger.error("회원 목록 조회 오류: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestPart("memberDTO") MemberRequest memberDTO, @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            Long memberId = memberService.register(memberDTO, image);
            return ResponseEntity.ok(memberId);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류 발생: " + e.getMessage());
        }
    }


    @GetMapping("/get-member")
    public ResponseEntity<?> getMemberByToken(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            MemberResponse member = memberService.getMemberById(userId);
            return member != null ? ResponseEntity.ok(member) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원을 찾을 수 없습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 조회 중 오류 발생: " + e.getMessage());
        }
    }


    @PutMapping("/update-member")
    public ResponseEntity<?> updateMemberByToken(HttpServletRequest request,
                                                 @RequestPart("memberUpdateRequestDTO") MemberUpdateRequest memberUpdateRequestDTO,
                                                 @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            int updateResult = memberService.updateMember(userId, memberUpdateRequestDTO, image);
            return updateResult == 1 ? ResponseEntity.ok(updateResult) : ResponseEntity.status(HttpStatus.NOT_FOUND).body("회원 정보를 찾을 수 없습니다.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 업로드 실패: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 정보 수정 중 오류 발생: " + e.getMessage());
        }
    }


    @GetMapping("/info")
    public ResponseEntity<MemberBasicInfoResponse> getUserInfo(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            Long userId = jwtUtil.extractUserId(token);
            String nickname = jwtUtil.extractNickname(token);
            return ResponseEntity.ok(new MemberBasicInfoResponse(userId, nickname));
        } catch (Exception e) {
            logger.error("회원 기본 정보 조회 오류: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(HttpServletRequest request, @RequestBody ChangePasswordRequest changePasswordRequest) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            boolean isPasswordChanged = memberService.changePassword(userId, changePasswordRequest);
            return isPasswordChanged ? ResponseEntity.ok("비밀번호 변경 완료") : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("현재 비밀번호가 일치하지 않습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없음: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 변경 중 오류 발생: " + e.getMessage());
        }
    }



    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(HttpServletRequest request, @RequestBody CheckPasswordRequest checkPasswordRequest) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            boolean isPasswordCorrect = memberService.checkPassword(userId, checkPasswordRequest.getPassword());
            return ResponseEntity.ok(isPasswordCorrect ? 1 : 0);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("비밀번호 확인 중 오류 발생: " + e.getMessage());
        }
    }


    @DeleteMapping("/withdraw")
    public ResponseEntity<String> deleteMember(HttpServletRequest request, HttpServletResponse response) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long memberId = jwtUtil.extractUserId(token);
            memberService.deleteMember(memberId);
            logoutUser(request, response);
            return ResponseEntity.ok("회원 탈퇴 및 로그아웃 완료");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원 탈퇴 중 오류 발생: " + e.getMessage());
        }
    }

    //카카오 로그아웃
    @GetMapping("/kakao/logout")
    public ResponseEntity<?> logout()
    {
        try {
            String redirectUrl = "https://kauth.kakao.com/oauth/logout?client_id="+apiKey+"&logout_redirect_uri=https://i11b105.p.ssafy.io";
            URI redirectUriWithParams = new URI(redirectUrl);
            // 리다이렉트
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setLocation(redirectUriWithParams);
            return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("로그아웃 실패");
        }
    }

    @PostMapping("/self-assessment")
    public ResponseEntity<?> createHealthReport(@RequestBody HealthReportRequest healthReportRequestDTO, HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            HealthReportResponse dto = memberService.saveHealthReport(healthReportRequestDTO, userId);
            return ResponseEntity.ok(dto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("자가진단 결과 기록 중 오류 발생: " + e.getMessage());
        }
    }


    @GetMapping("/self-assessment")
    public ResponseEntity<?> getHealthReports(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 토큰이 없습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            List<HealthReportResponse> healthReports = memberService.getHealthReportsByUserId(userId);
            return ResponseEntity.ok(healthReports);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("자가진단 결과 조회 중 오류 발생: " + e.getMessage());
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        return authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX) ? authorizationHeader.substring(BEARER_PREFIX.length()) : null;
    }

    private void logoutUser(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }
    }

    @GetMapping("/sidoNames")
    public List<String> getSidoNames() {
        return dongCodeRepository.findDistinctSidoNames();
    }

    @GetMapping("/gugunNames")
    public ResponseEntity<?> getGugunNamesBySidoName(@RequestParam String sidoName) {
        try {
            List<String> gugunNames = dongCodeRepository.findGugunNamesBySidoName(sidoName);
            if (gugunNames.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 시/도에 구군 정보를 찾을 수 없습니다.");
            }
            return ResponseEntity.ok(gugunNames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("구군 정보 조회 중 오류 발생: " + e.getMessage());
        }
    }

    @GetMapping("/dongNames")
    public ResponseEntity<?> getDongNamesBySidoNameAndGugunName(@RequestParam String sidoName, @RequestParam String gugunName) {
        try {
            List<String> dongNames = dongCodeRepository.findDongNamesBySidoNameAndGugunName(sidoName, gugunName);
            if (dongNames.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 시/도와 구군에 동 정보를 찾을 수 없습니다.");
            }
            return ResponseEntity.ok(dongNames);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("동 정보 조회 중 오류 발생: " + e.getMessage());
        }
    }


    @PostMapping("/register/check-email/{email}")
    public ResponseEntity<?> checkEmail(@PathVariable String email) {
        try {
            int result = memberService.duplicateCheckEmail(email);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 중복 확인 중 오류 발생: " + e.getMessage());
        }
    }

    @PostMapping("/register/check-nickname/{nickname}")
    public ResponseEntity<?> checkNickname(@PathVariable String nickname) {
        try {
            int result = memberService.duplicateCheckNickname(nickname);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("닉네임 중복 확인 중 오류 발생: " + e.getMessage());
        }
    }

    // 자가검진 기록 일주일간 기록 여부 검색
    @GetMapping("/self-assessment/check")
    public ResponseEntity<?> getSelfAssessmentCheck(HttpServletRequest request) {
        String token = getTokenFromRequest(request);
        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long userId = jwtUtil.extractUserId(token);
        Map<String, Object> response = memberService.getHealthReportStatsForMember(userId);
        return ResponseEntity.ok(response);
    }

}
