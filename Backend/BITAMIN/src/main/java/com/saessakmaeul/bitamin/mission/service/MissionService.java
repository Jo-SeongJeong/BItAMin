package com.saessakmaeul.bitamin.mission.service;

import com.saessakmaeul.bitamin.mission.entity.Mission;
import com.saessakmaeul.bitamin.mission.repository.MissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MissionService {

    private final MissionRepository missionRepository;

}
