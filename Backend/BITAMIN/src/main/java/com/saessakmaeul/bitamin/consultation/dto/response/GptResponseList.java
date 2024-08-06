package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.Data;

import java.util.Map;

@Data
public class GptResponseList {
    Map<String, GptResponse> gptResponses;
}
