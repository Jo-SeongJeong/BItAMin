package com.saessakmaeul.bitamin.consultation.service;

import com.saessakmaeul.bitamin.consultation.repository.ConsultationRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SchedulingService {
    private final ConsultationRepository consultationRepository;

    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Seoul")
    public void deleteOldConsultations() {
        List<Long> id = consultationRepository.findIdOfOldConsultations();

        consultationRepository.deleteAllById(id);
    }
}
