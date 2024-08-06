package com.saessakmaeul.bitamin.consultation.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class GptCompletionRequest {
    private Map<String, GptCompletion> gptCompletions;
}
