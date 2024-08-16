package com.saessakmaeul.bitamin.member.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.saessakmaeul.bitamin.exception.ApplicationException;
import com.saessakmaeul.bitamin.member.dto.request.*;
import com.saessakmaeul.bitamin.member.dto.request.HealthReportRequest;
import com.saessakmaeul.bitamin.member.dto.response.*;
import com.saessakmaeul.bitamin.member.entity.*;
import com.saessakmaeul.bitamin.member.repository.DongCodeRepository;
import com.saessakmaeul.bitamin.member.repository.HealthReportRepository;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.member.repository.RefreshTokenRepository;
import com.saessakmaeul.bitamin.mission.entity.UserExperience;
import com.saessakmaeul.bitamin.mission.repository.MemberExperienceRepository;
import com.saessakmaeul.bitamin.util.file.service.S3Service;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final HealthReportRepository healthReportRepository;
    private final DongCodeRepository dongCodeRepository;
    private final S3Service s3Service;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final MemberExperienceRepository memberExperienceRepository;

    @Value("${KAKAO_API_KEY}")
    private String apiKey;

    @Value("${GOOGLE_API_KEY}")
    private String googleApiKey;

    @Value("${GOOGLE_PASSWORD}")
    private String googlePassword;

    @Value("${NAVER_ID}")
    private String naverApiId;

    @Value("${NAVER_PASSWORD}")
    private String naverApiPassword;

    @Transactional
    public Long register(MemberRequest memberDTO, MultipartFile image) throws IOException {
        try {
            // 필수 값 체크
            if (memberDTO.getEmail() == null || memberDTO.getEmail().isEmpty()) {
                throw new IllegalArgumentException("이메일은 필수 입력 항목입니다.");
            }
            if (memberRepository.countByEmail(memberDTO.getEmail()) > 0) {
                throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
            }
            if (memberDTO.getPassword() == null || memberDTO.getPassword().isEmpty()) {
                throw new IllegalArgumentException("비밀번호는 필수 입력 항목입니다.");
            }
            if (memberDTO.getName() == null || memberDTO.getName().isEmpty()) {
                throw new IllegalArgumentException("이름은 필수 입력 항목입니다.");
            }
            if (memberDTO.getNickname() == null || memberDTO.getNickname().isEmpty()) {
                throw new IllegalArgumentException("닉네임은 필수 입력 항목입니다.");
            }
            if (memberRepository.countByNickname(memberDTO.getNickname()) > 0) {
                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
            }
            if (memberDTO.getSidoName() == null || memberDTO.getSidoName().isEmpty()) {
                throw new IllegalArgumentException("시,도 정보는 필수 입력 항목입니다.");
            }
            if (memberDTO.getBirthday() == null) {
                throw new IllegalArgumentException("생일은 필수 입력 항목입니다.");
            }

            String dongCode = findDongCode(memberDTO.getSidoName(), memberDTO.getGugunName(), memberDTO.getDongName());
            Member member = Member.builder()
                    .email(memberDTO.getEmail())
                    .password(passwordEncoder.encode(memberDTO.getPassword()))
                    .name(memberDTO.getName())
                    .nickname(memberDTO.getNickname())
                    .dongCode(dongCode)
                    .birthday(memberDTO.getBirthday())
                    .role(Role.ROLE_MEMBER)
                    .build();

            if (image != null && !image.isEmpty()) {
                String fileUrl = s3Service.uploadFile(image);
                member.setProfileUrl(fileUrl);
            } else if (image == null) {
                member.setProfileUrl("null");
            }

            member = memberRepository.save(member);

            UserExperience ue = new UserExperience();
            ue.setId(member.getId());
            memberExperienceRepository.save(ue);

            return member.getId();
        } catch (IOException e) {
            throw new IOException(e);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("잘못된 입력 값 : " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("입력 정보 부족 : " + e.getMessage(), e);
        }
    }


    public String findDongCode(String sidoName, String gugunName, String dongName) {
        return dongCodeRepository.findDongCode(sidoName, gugunName, dongName)
                .orElseThrow(() -> new IllegalArgumentException("해당 주소에 대한 동 코드를 찾을 수 없습니다."));
    }

    public List<MemberListResponse> getMemberList() {
        return memberRepository.findAll().stream()
                .map(member -> MemberListResponse.builder()
                        .id(member.getId())
                        .name(member.getName())
                        .email(member.getEmail())
                        .nickname(member.getNickname())
                        .password(member.getPassword())
                        .birthday(member.getBirthday())
                        .dongCode(member.getDongCode())
                        .profileUrl(member.getProfileUrl())
                        .role(member.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean changePassword(Long userId, ChangePasswordRequest changePasswordRequest) {
        try {
            // 필수 값 체크
            if (changePasswordRequest.getCurrentPassword() == null || changePasswordRequest.getCurrentPassword().isEmpty()) {
                throw new IllegalArgumentException("현재 비밀번호는 필수 입력 항목입니다.");
            }
            if (changePasswordRequest.getNewPassword() == null || changePasswordRequest.getNewPassword().isEmpty()) {
                throw new IllegalArgumentException("새 비밀번호는 필수 입력 항목입니다.");
            }

            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                if (passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), member.getPassword())) {
                    member.setPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
                    memberRepository.save(member);
                    return true;
                } else {
                    throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
                }
            } else {
                throw new NoSuchElementException("사용자를 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException | NoSuchElementException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("비밀번호 변경 중 오류 발생", e);
        }
    }


    @Transactional
    public boolean checkPassword(Long userId, String password) {
        try {
            // 필수 값 체크
            if (password == null || password.isEmpty()) {
                throw new IllegalArgumentException("비밀번호는 필수 입력 항목입니다.");
            }

            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                if (passwordEncoder.matches(password, member.getPassword())) {
                    return true;
                } else {
                    throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
                }
            } else {
                throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Transactional
    public void deleteMember(Long memberId) {
        try {
            if (!memberRepository.existsById(memberId)) {
                throw new IllegalArgumentException("회원 정보를 찾을 수 없습니다.");
            }
            refreshTokenRepository.deleteByUserId(memberId);
            healthReportRepository.deleteById(memberId);
            memberRepository.deleteById(memberId);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    //네이버 로그인
    public LoginRequest naverLogin(String code) throws Exception {
        // 엑세스 토큰 획득
        String accessToken = getNavertoken(code);
        // 로그인 진행
        return getNaverLoginRequest(accessToken);
    }

    // 네이버 엑세스 토큰 획득
    private String getNavertoken(String code) throws JsonProcessingException {
        String tokenUrl = "https://nid.naver.com/oauth2.0/token";

        // 요청으로 엑세스 토큰 꺼내기
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();

        String naverURI = UriComponentsBuilder.fromHttpUrl(tokenUrl)
                .queryParam("grant_type", "authorization_code")
                .queryParam("client_id", naverApiId)
                .queryParam("client_secret", naverApiPassword)
                .queryParam("code", code)
                .build()
                .encode()
                .toUriString();

        HttpEntity<MultiValueMap<String, String>> tokenRequestEntity = new HttpEntity<>(tokenBody, tokenHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.exchange(naverURI, HttpMethod.GET, tokenRequestEntity, String.class);

        // 엑세스 토큰 꺼내기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode tokenJsonNode = objectMapper.readTree(tokenResponse.getBody());
        return tokenJsonNode.get("access_token").asText();
    }

    private LoginRequest getNaverLoginRequest(String accessToken) throws Exception {
        String userInfoUrl = "https://openapi.naver.com/v1/nid/me";

        // 엑세스 토큰으로 검색
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.add("Authorization", "Bearer " + accessToken);
        userInfoHeaders.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> userInfoBody = new LinkedMultiValueMap<>();

        HttpEntity<MultiValueMap<String, String>> userInfoRequestEntity = new HttpEntity<>(userInfoBody, userInfoHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.GET, userInfoRequestEntity, String.class);

        // 결과값 꺼내오기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode userInfoJsonNode = objectMapper.readTree(userInfoResponse.getBody());
        System.out.println(userInfoJsonNode);
        String id = userInfoJsonNode.get("response").get("id").asText();
        String email = userInfoJsonNode.get("response").get("email").asText();

        // 저장된 유저가 없다면 Exception 발생
        memberRepository.findByEmail(email).orElseThrow(() -> new Exception("N:등록된 유저가 없습니다./" + email + "/" + id));

        // 저장된 유저가 있다면 로그인을 위해 request body 생성
        return new LoginRequest(email, id);
    }

    //구글 로그인
    public LoginRequest googleLogin(String code) throws Exception {
        // 엑세스 토큰 획득
        String accessToken = getgoogletoken(code);
        // 로그인 진행
        return getGoogleLoginRequest(accessToken);
    }

    // 구글 엑세스 토큰 획득
    private String getgoogletoken(String code) throws JsonProcessingException {
        String redirectUri = "https://i11b105.p.ssafy.io/api/auth/google"; // 배포
//        String redirectUri = "http://localhost:8080/api/auth/google"; // 테스트
        String tokenUrl = "https://oauth2.googleapis.com/token";

        // 요청으로 엑세스 토큰 꺼내기
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
        tokenBody.add("grantType", "authorization_code");
        tokenBody.add("clientId", googleApiKey);
        tokenBody.add("clientSecret", googlePassword);
        tokenBody.add("redirectUri", redirectUri);
        tokenBody.add("code", code);

        HttpEntity<MultiValueMap<String, String>> tokenRequestEntity = new HttpEntity<>(tokenBody, tokenHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequestEntity, String.class);

        // 엑세스 토큰 꺼내기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode tokenJsonNode = objectMapper.readTree(tokenResponse.getBody());
        return tokenJsonNode.get("id_token").asText();
    }

    private LoginRequest getGoogleLoginRequest(String accessToken) throws Exception {
        String userInfoUrl = "https://oauth2.googleapis.com/tokeninfo";

        // 엑세스 토큰으로 검색
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> userInfoBody = new LinkedMultiValueMap<>();
        userInfoBody.add("id_token", accessToken);

        HttpEntity<MultiValueMap<String, String>> userInfoRequestEntity = new HttpEntity<>(userInfoBody, userInfoHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.POST, userInfoRequestEntity, String.class);

        // 결과값 꺼내오기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode userInfoJsonNode = objectMapper.readTree(userInfoResponse.getBody());
        String id = userInfoJsonNode.get("sub").asText();
        String email = userInfoJsonNode.get("email").asText();

        // 저장된 유저가 없다면 Exception 발생
        memberRepository.findByEmail(email).orElseThrow(() -> new Exception("G:등록된 유저가 없습니다./" + email + "/" + id));

        // 저장된 유저가 있다면 로그인을 위해 request body 생성
        return new LoginRequest(email, id);
    }

    public LoginRequest kakaoLogin(String code) throws Exception {
        // 엑세스 토큰 획득
        String accessToken = getKakaotoken(code);
        // 로그인 진행
        return getLoginRequest(accessToken);
    }

    // 카카오톡 엑세스 토큰 획득
    private String getKakaotoken(String code) throws JsonProcessingException {
        String redirectUri = "https://i11b105.p.ssafy.io/api/auth/kakao"; // 배포
//        String redirectUri = "http://localhost:8080/api/auth/kakao"; // 테스트
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        // 요청으로 엑세스 토큰 꺼내기
        HttpHeaders tokenHeaders = new HttpHeaders();
        tokenHeaders.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> tokenBody = new LinkedMultiValueMap<>();
        tokenBody.add("grant_type", "authorization_code");
        tokenBody.add("client_id", apiKey);
        tokenBody.add("redirect_uri", redirectUri);
        tokenBody.add("code", code);

        HttpEntity<MultiValueMap<String, String>> tokenRequestEntity = new HttpEntity<>(tokenBody, tokenHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> tokenResponse = restTemplate.exchange(tokenUrl, HttpMethod.POST, tokenRequestEntity, String.class);

        // 엑세스 토큰 꺼내기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode tokenJsonNode = objectMapper.readTree(tokenResponse.getBody());
        return tokenJsonNode.get("access_token").asText();
    }

    private LoginRequest getLoginRequest(String accessToken) throws Exception {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        // 엑세스 토큰으로 검색
        HttpHeaders userInfoHeaders = new HttpHeaders();
        userInfoHeaders.add("Authorization", "Bearer " + accessToken);
        userInfoHeaders.add("Content-Type", "application/x-www-form-urlencoded");

        MultiValueMap<String, String> userInfoBody = new LinkedMultiValueMap<>();
        userInfoBody.add("property_keys", "[\"kakao_account.profile\",\"kakao_account.email\"]");

        HttpEntity<MultiValueMap<String, String>> userInfoRequestEntity = new HttpEntity<>(userInfoBody, userInfoHeaders);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> userInfoResponse = restTemplate.exchange(userInfoUrl, HttpMethod.POST, userInfoRequestEntity, String.class);

        // 결과값 꺼내오기
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode userInfoJsonNode = objectMapper.readTree(userInfoResponse.getBody());
        String id = userInfoJsonNode.get("id").asText();
        String email = userInfoJsonNode.get("kakao_account").get("email").asText();
        System.out.println(passwordEncoder.encode(id));

        // 저장된 유저가 없다면 Exception 발생
        memberRepository.findByEmail(email).orElseThrow(() -> new Exception("K:등록된 유저가 없습니다./" + email + "/" + id));

        // 저장된 유저가 있다면 로그인을 위해 request body 생성
        return new LoginRequest(email, id);
    }


    public MemberResponse getMemberById(Long userId) {
        try {
            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                Optional<DongCodeResponse> dongInformationOptional = dongCodeRepository.findNamesByDongCode(member.getDongCode());
                if (dongInformationOptional.isPresent()) {
                    DongCodeResponse dongInformation = dongInformationOptional.get();
                    return MemberResponse.builder()
                            .email(member.getEmail())
                            .password(member.getPassword())
                            .name(member.getName())
                            .nickname(member.getNickname())
                            .sidoName(dongInformation.getSidoName())
                            .gugunName(dongInformation.getGugunName())
                            .dongName(dongInformation.getDongName())
                            .xCoordinate(dongInformation.getXCoordinate())
                            .yCoordinate(dongInformation.getYCoordinate())
                            .lat(dongInformation.getLat())
                            .lng(dongInformation.getLng())
                            .birthday(member.getBirthday())
                            .profileUrl(member.getProfileUrl())
                            .build();
                } else {
                    throw new IllegalArgumentException("해당 동코드에 대한 정보를 찾을 수 없습니다.");
                }
            } else {
                throw new IllegalArgumentException("회원을 찾을 수 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    @Transactional
    public int updateMember(Long userId, MemberUpdateRequest memberUpdateRequestDTO, MultipartFile image) throws IOException {
        try {
            // 필수 값 체크
            if (memberUpdateRequestDTO.getName() == null || memberUpdateRequestDTO.getName().isEmpty()) {
                throw new IllegalArgumentException("이름은 필수 입력 항목입니다.");
            }
            if (memberUpdateRequestDTO.getNickname() == null || memberUpdateRequestDTO.getNickname().isEmpty()) {
                throw new IllegalArgumentException("닉네임은 필수 입력 항목입니다.");
            }
            if (memberUpdateRequestDTO.getBirthday() == null) {
                throw new IllegalArgumentException("생일은 필수 입력 항목입니다.");
            }

            Optional<Member> optionalMember = memberRepository.findById(userId);
            if (optionalMember.isPresent()) {
                Member member = optionalMember.get();
                member.setName(memberUpdateRequestDTO.getName());
                member.setNickname(memberUpdateRequestDTO.getNickname());
                member.setBirthday(memberUpdateRequestDTO.getBirthday());
                member.setProfileUrl(memberUpdateRequestDTO.getProfileUrl());

                if (memberUpdateRequestDTO.getSidoName() != null || memberUpdateRequestDTO.getGugunName() != null || memberUpdateRequestDTO.getDongName() != null) {
                    String dongCode = findDongCode(memberUpdateRequestDTO.getSidoName(), memberUpdateRequestDTO.getGugunName(), memberUpdateRequestDTO.getDongName());
                    member.setDongCode(dongCode);
                }

                if (image != null && !image.isEmpty()) {
                    String fileUrl = s3Service.uploadFile(image);
                    member.setProfileUrl(fileUrl);
                }

                memberRepository.save(member);
                return 1;
            } else {
                throw new IllegalArgumentException("회원 정보를 찾을 수 없습니다.");
            }
        } catch (IOException e) {
            throw new IOException(e);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(e);
        } catch (Exception e) {
            throw new RuntimeException("회원 정보 수정 중 오류 발생", e);
        }
    }


    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getEmail().isEmpty()) {
                throw new IllegalArgumentException("이메일은 필수 입력 항목입니다.");
            }
            if (loginRequest.getPassword() == null || loginRequest.getPassword().isEmpty()) {
                throw new IllegalArgumentException("비밀번호는 필수 입력 항목입니다.");
            }

            Member user = memberRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtUtil.generateRefreshToken(user);

            Optional<RefreshToken> existingToken = refreshTokenRepository.findById(user.getId());
            RefreshToken token;
            ZonedDateTime zonedDateTime = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
            LocalDateTime localDateTimeInKorea = zonedDateTime.toLocalDateTime();
            LocalDateTime expireDate = localDateTimeInKorea.plus(jwtUtil.getRefreshTokenExpiration(), ChronoUnit.MILLIS);

            if (existingToken.isPresent()) {
                token = existingToken.get();
                token.setToken(refreshToken);
                token.setExpireDate(expireDate);
            } else {
                token = new RefreshToken();
                token.setToken(refreshToken);
                token.setExpireDate(expireDate);
                token.setUser(user);
            }
            refreshTokenRepository.save(token);

            return new AuthResponse(jwt, refreshToken, true);
        } catch (BadCredentialsException e) {
            throw new RuntimeException(e);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException(e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    public AuthResponse refreshToken(String cookieRefreshToken) {
        try {
            if (jwtUtil.isTokenExpired(cookieRefreshToken)) {
                throw new ApplicationException.UnauthorizedException("Refresh Token이 만료되었습니다.");
            }
            String email = jwtUtil.extractEmail(cookieRefreshToken);
            Member member = memberRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 이메일입니다."));
            Long userId = member.getId();
            Optional<RefreshToken> refreshToken = refreshTokenRepository.findByUserId(userId);
            if (refreshToken.isPresent() && refreshToken.get().getToken().equals(cookieRefreshToken)) {
                String newAccessToken = jwtUtil.generateAccessToken(memberRepository.findById(userId)
                        .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다.")));
                return new AuthResponse(newAccessToken, cookieRefreshToken, true);
            } else {
                throw new ApplicationException.UnauthorizedException("유효한 Refresh Token이 없습니다.");
            }
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }


    @Transactional
    public void logout(Long userId) {
        try {
            SecurityContextHolder.clearContext();
            jwtUtil.invalidateRefreshTokenByUserId(userId);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


    public String getUserRole(String token) {
        try {
            return jwtUtil.extractRole(token);
        } catch (Exception e) {
            throw new RuntimeException("회원 권한 조회 실패: " + e.getMessage());
        }
    }

    @Transactional
    public HealthReportResponse saveHealthReport(HealthReportRequest healthReportRequestDTO, Long userId) {
        try {
            HealthReport healthReport = new HealthReport();
            healthReport.setCheckupScore(healthReportRequestDTO.getCheckupScore());
            healthReport.setCheckupDate(LocalDate.now());

            Member member = memberRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 회원 ID입니다."));
            healthReport.setMember(member);

            HealthReport savedHealthReport = healthReportRepository.save(healthReport);

            HealthReportResponse healthReportResponseDTO = new HealthReportResponse();
            healthReportResponseDTO.setId(savedHealthReport.getId());
            healthReportResponseDTO.setCheckupScore(savedHealthReport.getCheckupScore());
            healthReportResponseDTO.setCheckupDate(savedHealthReport.getCheckupDate());
            healthReportResponseDTO.setMemberId(userId);

            return healthReportResponseDTO;
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("자가진단 결과 저장 중 오류 발생", e);
        }
    }


    public List<HealthReportResponse> getHealthReportsByUserId(Long userId) {
        try {
            List<HealthReport> healthReports = healthReportRepository.findByMemberId(userId);
            if (healthReports.isEmpty()) {
                throw new IllegalArgumentException("등록된 결과가 없습니다.");
            }
            return healthReports.stream().map(healthReport -> {
                HealthReportResponse dto = new HealthReportResponse();
                dto.setId(healthReport.getId());
                dto.setCheckupScore(healthReport.getCheckupScore());
                dto.setCheckupDate(healthReport.getCheckupDate());
                dto.setMemberId(userId);
                return dto;
            }).collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public int duplicateCheckEmail(String email) {
        try {
            int result = memberRepository.countByEmail(email);
            if (result == 1) {
                return 1;
            }
            return 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public int duplicateCheckNickname(String nickname) {
        try {
            int result = memberRepository.countByNickname(nickname);
            if (result == 1) {
                return 1;
            }
            return 0;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public Map<String, Object> getHealthReportStatsForMember(Long userId) {
        LocalDate nowDate = LocalDate.now();
        LocalDate beforeDate = nowDate.minusDays(7);

        List<Object[]> result = healthReportRepository.findCountAndLatestCheckupDate(userId, beforeDate, nowDate);
        Object[] data = result.get(0);

        Long count = (Long) data[0];
        LocalDate latestCheckupDate = (LocalDate) data[1];

        Map<String, Object> response = new HashMap<>();
        response.put("result", count > 0 ? 1 : 0);
        response.put("latestCheckupDate", latestCheckupDate);

        return response;
    }

}