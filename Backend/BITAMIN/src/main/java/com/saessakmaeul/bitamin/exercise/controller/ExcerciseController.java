package com.saessakmaeul.bitamin.exercise.controller;

import com.saessakmaeul.bitamin.exercise.dto.response.ExcersizeDetailResponse;
import com.saessakmaeul.bitamin.exercise.dto.response.ExcersizeModelResponse;
import com.saessakmaeul.bitamin.exercise.service.ExcersizeService;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/exercises")
public class ExcerciseController {
    @Autowired
    private ExcersizeService excersizeService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/{id}")
    public ResponseEntity<?> getExcersize(@PathVariable(name = "id") long id, @RequestHeader(name = "Authorization",required = false) String token) {
        try{
//            if(jwtUtil.isTokenExpired(token.substring(7))) throw new Exception("유저가 유효하지 않습니다.");
            ExcersizeDetailResponse response = excersizeService.getExcersize(id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/model/{level}")
    public ResponseEntity<?> getModel(@PathVariable(name = "level") int level, @RequestHeader(name = "Authorization",required = false) String token) {
        try{
            ExcersizeModelResponse response = excersizeService.getExcersizeModel(level);
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
