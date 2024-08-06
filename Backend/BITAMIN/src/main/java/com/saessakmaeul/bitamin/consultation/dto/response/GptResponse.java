package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GptResponse {
    String role;
    String content;
}
