package com.saessakmaeul.bitamin.exercise.service;

import com.saessakmaeul.bitamin.exercise.dto.response.ExcersizeDetailResponse;
import com.saessakmaeul.bitamin.exercise.dto.response.ExcersizeModelResponse;
import com.saessakmaeul.bitamin.exercise.entity.Excersize;
import com.saessakmaeul.bitamin.exercise.entity.ExcersizeModel;
import com.saessakmaeul.bitamin.exercise.repository.ExcersizeModelRepository;
import com.saessakmaeul.bitamin.exercise.repository.ExcersizeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class ExcersizeService {
    @Autowired
    private ExcersizeRepository excersizeRepository;

    @Autowired
    private ExcersizeModelRepository excersizeModelRepository;

    public ExcersizeDetailResponse getExcersize(long id) throws Exception{
        Excersize excersize = excersizeRepository.findById(id).orElseThrow(()->new Exception("해당 id의 운동이 존재하지 않습니다."));
        ExcersizeDetailResponse result = ExcersizeDetailResponse.builder()
                .id(excersize.getId())
                .title(excersize.getTitle())
                .description(excersize.getDescription())
                .level(excersize.getLevel())
                .exerciseUrl(excersize.getExerciseUrl())
                .build();
        return result;
    }

    public ExcersizeModelResponse getExcersizeModel(int level) {
        List<ExcersizeModel> modelList = excersizeModelRepository.findAllByLevel(level);
        Random random = new Random();
        ExcersizeModel model = modelList.get(random.nextInt(modelList.size()));
        ExcersizeModelResponse result = ExcersizeModelResponse.builder()
                .id(model.getId())
                .modelUrl(model.getModelUrl())
                .firstExercise(model.getFirstExercise())
                .secondExercise(model.getSecondExercise())
                .thirdExercise(model.getThirdExercise())
                .build();
        return result;
    }
}
