package com.saessakmaeul.bitamin.config;

import io.openvidu.java.client.OpenVidu;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Getter
@Setter
public class OpenViduConfig {

    @Value("${openvidu.url}")
    private String openviduUrl;

    @Value("${openvidu.secret}")
    private String secret;

    @Bean
    public OpenVidu openVidu() {
        return new OpenVidu(openviduUrl, secret);
    }
}
