package com.saessakmaeul.bitamin.filter;

import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import com.saessakmaeul.bitamin.member.service.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String userEmail = null;
        String jwt = null;

        String method = request.getMethod();
        String requestURI = request.getRequestURI();

        logger.debug(requestURI + " " + method);
        System.out.println(requestURI);
         if(requestURI.startsWith("/api/auth/login") ||
                 requestURI.startsWith("/api/auth/kakao") ||
                 requestURI.startsWith("/api/auth/google") ||
                 requestURI.startsWith("/api/auth/naver") ||
                 requestURI.startsWith("/api/members/register") ||
                 requestURI.startsWith("/api/members/sidoNames") ||
                 requestURI.startsWith("/api/members/gugunNames") ||
                 requestURI.startsWith("/api/members/dongNames") ||
                 requestURI.startsWith("/api/ws")) {
             chain.doFilter(request, response);
             return;
         }

         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
             response.getWriter().write("The token is missing or invalid");
             return;
         }

         jwt = authorizationHeader.substring(7);
         userEmail = jwtUtil.extractEmail(jwt);

         if (userEmail == null) {
             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
             response.getWriter().write("No email: Unable to authenticate.");
             return;
         }

         if(SecurityContextHolder.getContext().getAuthentication() != null) {
             chain.doFilter(request, response);
             return;
         }

         UserDetails userDetails = this.customUserDetailsService.loadUserByUsername(userEmail);

         if (!jwtUtil.extractEmail(jwt).equals(userDetails.getUsername()) || jwtUtil.isTokenExpired(jwt)) {
             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
             response.getWriter().write("The email is not valid, or the token has expired.");
             return;
         }

         UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(userDetails, jwt, userDetails.getAuthorities());

         usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

         SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);

         chain.doFilter(request, response);
    }

}
