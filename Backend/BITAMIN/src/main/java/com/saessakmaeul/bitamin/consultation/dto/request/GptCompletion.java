package com.saessakmaeul.bitamin.consultation.dto.request;
import lombok.*;

import java.util.List;

/**
 * 새로운 모델에 대한 요청 객체를 관리합니다. : gpt-4, gpt-4 turbo, gpt-3.5-turbo
 */

@Data
public class GptCompletion {
    private String model;
    private List<GptRequest> messages;
    
}