package com.saessakmaeul.bitamin.consultation.dto.request;
import lombok.*;

@Data
@AllArgsConstructor
public class GptRequest {

    private String role;
    private String content;

}