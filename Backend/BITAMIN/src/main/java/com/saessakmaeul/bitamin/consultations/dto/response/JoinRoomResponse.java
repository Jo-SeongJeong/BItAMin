package com.saessakmaeul.bitamin.consultations.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class JoinRoomResponse {
    private Long id;
    private String token;
}
