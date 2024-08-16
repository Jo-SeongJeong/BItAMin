package com.saessakmaeul.bitamin.member.controller;

import com.saessakmaeul.bitamin.exception.ApplicationException;
import com.saessakmaeul.bitamin.member.dto.request.LoginRequest;
import com.saessakmaeul.bitamin.member.dto.response.AuthResponse;
import com.saessakmaeul.bitamin.member.service.MemberService;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.StringTokenizer;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private static final String BEARER_PREFIX = "Bearer ";
    private final MemberService memberService;
    private final JwtUtil jwtUtil;

    @Value("${KAKAO_API_KEY}")
    private String apiKey;

    @Value("${GOOGLE_API_KEY}")
    private String googleApiKey;

    @Value("${NAVER_ID}")
    private String naverApiId;

    @Autowired
    public AuthController(MemberService memberService, JwtUtil jwtUtil) {
        this.memberService = memberService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        try {
            AuthResponse authResponse = memberService.login(loginRequest);

            response.setHeader("Authorization", BEARER_PREFIX + authResponse.getAccessToken());

            Cookie refreshTokenCookie = new Cookie("refreshToken", authResponse.getRefreshToken());
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge((int) jwtUtil.getRefreshTokenExpiration() / 1000);
            response.addCookie(refreshTokenCookie);

            // 보안 강화를 위해 응답 본문에서 refresh token 삭제
            authResponse.setRefreshToken(null);

            return ResponseEntity.ok(authResponse);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 실패: " + e.getMessage());
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        try {
            String cookieRefreshToken = getRefreshTokenFromCookies(request.getCookies());
            if (cookieRefreshToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh Token이 쿠키에 존재하지 않습니다.");
            }
            AuthResponse authResponse = memberService.refreshToken(cookieRefreshToken);
            response.setHeader("Authorization", BEARER_PREFIX + authResponse.getAccessToken());
            return ResponseEntity.ok("토큰이 재발급 되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("잘못된 요청: " + e.getMessage());
        } catch (ApplicationException.UnauthorizedException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("AccessToken 재생성 실패: " + e.getMessage());
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                throw new ApplicationException.UnauthorizedException("토큰이 제공되지 않았습니다.");
            }
            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                throw new ApplicationException.UnauthorizedException("유효하지 않은 토큰입니다.");
            }
            memberService.logout(userId);
            return ResponseEntity.ok("로그아웃 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그아웃 실패: " + e.getMessage());
        }
    }

    @GetMapping("/role")
    public ResponseEntity<String> getUserRole(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            String role = memberService.getUserRole(token);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 소셜 로그인 과정
    /*
        1. kakao 소셜 로그인 요청(버튼 클릭)
        2. kakao 로그인 창으로 이동
        3. 로그인시 엑세스 토큰 획득
        4. 엑세스 토큰으로 DB에 확인
            4.1. 정보가 있는 경우 로그인
            4.2. 정보가 없는 경우 회원가입 창으로 이동(email,이름,비밀번호 넘겨주기)
     */
    @GetMapping("/kakao/login")
    public ResponseEntity<?> kakaoLogin() throws URISyntaxException {
        String redirectUri = "https://i11b105.p.ssafy.io/api/auth/kakao"; //배포
//        String redirectUri = "http://localhost:8080/api/auth/kakao"; //테스트
        String kakaoAuthUri = "https://kauth.kakao.com/oauth/authorize?client_id=" + apiKey + "&redirect_uri=" + redirectUri + "&response_type=code";
        // 리다이렉트
        HttpHeaders httpHeaders = new HttpHeaders();
        URI redirectUriWithParams = new URI(kakaoAuthUri);
        httpHeaders.setLocation(redirectUriWithParams);
        return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
    }


    @GetMapping("/kakao")
    public ResponseEntity<?> kakao(@RequestParam("code") String code) throws Exception {
        try{
            // 로그인
            LoginRequest loginRequest = memberService.kakaoLogin(code);
//            URI redirectUri = new URI("http://localhost:5173/login?email="+loginRequest.getEmail()+"&password="+loginRequest.getPassword());
            URI redirectUri = new URI("https://i11b105.p.ssafy.io/login?email="+loginRequest.getEmail()+"&password="+loginRequest.getPassword());
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setLocation(redirectUri);
            return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
        } catch (Exception e) {
            if(e.getMessage().contains("K:등록된 유저가 없습니다.")){
                StringTokenizer st = new StringTokenizer(e.getMessage(),"/");
                st.nextToken();
                // 리다이렉트
                String redirectUrl = "https://i11b105.p.ssafy.io/signup?email="+st.nextToken()+"&password="+st.nextToken(); // 배포
//                 String redirectUrl =  "http://localhost:5173/signup?email="+st.nextToken()+"&password="+st.nextToken(); //테스트
                URI redirectUriWithParams = new URI(redirectUrl);
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.setLocation(redirectUriWithParams);
                return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
            }
            return ResponseEntity.status(500).body("로그인 실패");
        }
    }

    // 소셜 로그인 과정
    /*
        1. google 소셜 로그인 요청(버튼 클릭)
        2. google 로그인 창으로 이동
        3. 로그인시 엑세스 토큰 획득
        4. 엑세스 토큰으로 DB에 확인
            4.1. 정보가 있는 경우 로그인
            4.2. 정보가 없는 경우 회원가입 창으로 이동(email,이름,비밀번호 넘겨주기)
     */
    @GetMapping("/google/login")
    public ResponseEntity<?> googleLogin() throws URISyntaxException {
        String redirectUri = "https://i11b105.p.ssafy.io/api/auth/google"; //배
//        String redirectUri = "http://localhost:8080/api/auth/google"; // 테스트용
        String scope = "email profile openid";

        // 공백때문에 uri처리 추가
        String googleAuthUri = UriComponentsBuilder.fromHttpUrl("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", googleApiKey)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", scope)
                .build()
                .encode()
                .toUriString();

        // 리다이렉트
        HttpHeaders httpHeaders = new HttpHeaders();
        URI redirectUriWithParams = new URI(googleAuthUri);
        httpHeaders.setLocation(redirectUriWithParams);
        return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
    }

    @GetMapping("/google")
    public ResponseEntity<?> google(@RequestParam("code") String code) throws Exception {
        try{
            // 로그인
            LoginRequest loginRequest = memberService.googleLogin(code);
//            URI redirectUri = new URI("http://localhost:5173/login?email="+loginRequest.getEmail()+"&password="+loginRequest.getPassword());
            URI redirectUri = new URI("https://i11b105.p.ssafy.io/login?email="+loginRequest.getEmail()+"&password="+loginRequest.getPassword());
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setLocation(redirectUri);
            return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
        } catch (Exception e) {
            if(e.getMessage().contains("G:등록된 유저가 없습니다.")){
                StringTokenizer st = new StringTokenizer(e.getMessage(),"/");
                st.nextToken();
                // 리다이렉트
                String redirectUrl = "https://i11b105.p.ssafy.io/signup?email="+st.nextToken()+"&password="+st.nextToken(); // 배포
//                 String redirectUrl =  "http://localhost:5173/signup?email="+st.nextToken()+"&password="+st.nextToken(); //테스트
                URI redirectUriWithParams = new URI(redirectUrl);
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.setLocation(redirectUriWithParams);
                return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
            }
            return ResponseEntity.status(500).body("로그인 실패");
        }
    }

    // 소셜 로그인 과정
    /*
        1. naver 소셜 로그인 요청(버튼 클릭)
        2. naver 로그인 창으로 이동
        3. 로그인시 엑세스 토큰 획득
        4. 엑세스 토큰으로 DB에 확인
            4.1. 정보가 있는 경우 로그인
            4.2. 정보가 없는 경우 회원가입 창으로 이동(email,이름,비밀번호 넘겨주기)
     */
    @GetMapping("/naver/login")
    public ResponseEntity<?> naverLogin() throws URISyntaxException {
        String redirectUri = "https://i11b105.p.ssafy.io/api/auth/naver"; //배포
//        String redirectUri = "http://localhost:8080/api/auth/naver"; // 테스트용

        // 공백때문에 uri처리 추가
        String googleAuthUri = UriComponentsBuilder.fromHttpUrl("https://nid.naver.com/oauth2.0/authorize")
                .queryParam("client_id", naverApiId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("state", "bitamin")
                .build()
                .encode()
                .toUriString();

        // 리다이렉트
        HttpHeaders httpHeaders = new HttpHeaders();
        URI redirectUriWithParams = new URI(googleAuthUri);
        httpHeaders.setLocation(redirectUriWithParams);
        return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
    }

    @GetMapping("/naver")
    public ResponseEntity<?> naver(@RequestParam("code") String code) throws Exception {
        try{
            // 로그인
            LoginRequest loginRequest = memberService.naverLogin(code);
//            URI redirectUri = new URI("http://localhost:5173/login?email="+loginRequest.getEmail()+"&password="+loginRequest.getPassword());
            URI redirectUri = new URI("https://i11b105.p.ssafy.io/login?email="+loginRequest.getEmail()+"&password="+loginRequest.getPassword());
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setLocation(redirectUri);
            return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
        } catch (Exception e) {
            if(e.getMessage().contains("N:등록된 유저가 없습니다.")){
                StringTokenizer st = new StringTokenizer(e.getMessage(),"/");
                st.nextToken();
                // 리다이렉트
                String redirectUrl = "https://i11b105.p.ssafy.io/signup?email="+st.nextToken()+"&password="+st.nextToken(); // 배포
//                 String redirectUrl =  "http://localhost:5173/signup?email="+st.nextToken()+"&password="+st.nextToken(); //테스트
                URI redirectUriWithParams = new URI(redirectUrl);
                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.setLocation(redirectUriWithParams);
                return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
            }
            return ResponseEntity.status(500).body("로그인 실패");
        }
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith(BEARER_PREFIX)) {
            return bearerToken.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    private String getRefreshTokenFromCookies(Cookie[] cookies) {
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}
