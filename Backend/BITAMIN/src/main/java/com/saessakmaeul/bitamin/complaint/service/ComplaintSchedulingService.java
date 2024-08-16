package com.saessakmaeul.bitamin.complaint.service;

import com.saessakmaeul.bitamin.complaint.entity.UserStop;
import com.saessakmaeul.bitamin.complaint.repository.UserStopRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintSchedulingService {
    @Autowired
    private UserStopRepository userStopRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void complaintScheduling() {
        try {
            for(UserStop userStop : userStopRepository.findAll()) {
                System.out.println(userStop.getId());
            }
            userStopRepository.deleteByStopDateIsLessThan(LocalDateTime.now());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
