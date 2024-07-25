package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.request.HealthReportRequestDTO;
import com.saessakmaeul.bitamin.member.dto.response.HealthReportResponseDTO;

import java.util.List;

public interface HealthReportService {
    HealthReportResponseDTO saveHealthReport(HealthReportRequestDTO healthReportRequestDTO, Long userId);
    List<HealthReportResponseDTO> getHealthReportsByUserId(Long userId);
}
