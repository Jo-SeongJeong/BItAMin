package com.saessakmaeul.bitamin.consultations.dto.request;

import com.saessakmaeul.bitamin.consultations.Entity.SerchCondition;
import lombok.Data;

@Data
public class SelectAllResquest {
    private int page;
    private int size;
    private SerchCondition type;
}
