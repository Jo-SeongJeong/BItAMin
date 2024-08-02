package com.saessakmaeul.bitamin.consultation.dto.response;

import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@Getter
@EqualsAndHashCode
public class SelectAllResponse {
    private List<ConsultationListResponse> consultationList;

    // 추가 페이징 정보
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;

}
