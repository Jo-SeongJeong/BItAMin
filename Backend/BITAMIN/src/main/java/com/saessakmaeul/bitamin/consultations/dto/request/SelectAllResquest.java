package com.saessakmaeul.bitamin.consultations.dto.request;

import com.saessakmaeul.bitamin.consultations.Entity.SerchCondition;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SelectAllResquest {
    private int page;
    private int size;
    private SerchCondition type;
}
