package com.saessakmaeul.bitamin.interceptor;

import com.saessakmaeul.bitamin.member.service.CustomUserDetailsService;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

        System.out.println("asd: " + accessor);
        System.out.println(message);


        //토큰 존재 여부 확인
        if (accessor.getCommand() == StompCommand.CONNECT) {
            String authorizationHeader = accessor.getFirstNativeHeader("Authorization");

            System.out.println(authorizationHeader);

            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                throw new IllegalArgumentException("The token is missing or invalid");
            }

            String jwt = authorizationHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(jwt);

            if (userEmail == null) {
                throw new IllegalArgumentException("No email: Unable to authenticate.");
            }

            UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);

            if (!jwtUtil.extractEmail(jwt).equals(userDetails.getUsername()) || jwtUtil.isTokenExpired(jwt)) {
                throw new AuthenticationException("The email is not valid, or the token has expired.") {
                };
            }

            UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, jwt, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

            accessor.setUser(usernamePasswordAuthenticationToken);

        }

        return message;
    }

}
