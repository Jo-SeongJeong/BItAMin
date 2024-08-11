package com.saessakmaeul.bitamin.exercise.repository;

import com.saessakmaeul.bitamin.exercise.entity.ExcersizeModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExcersizeModelRepository extends JpaRepository<ExcersizeModel,Long> {
    List<ExcersizeModel> findAllByLevel(int level);
}
