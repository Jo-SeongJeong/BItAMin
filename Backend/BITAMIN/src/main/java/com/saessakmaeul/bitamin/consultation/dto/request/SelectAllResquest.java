package com.saessakmaeul.bitamin.consultation.dto.request;

import com.saessakmaeul.bitamin.consultation.Entity.SearchCondition;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SelectAllResquest {
    private int page;
    private int size;
    private SearchCondition type;
}
