package com.saessakmaeul.bitamin.complaint.controller;

import com.saessakmaeul.bitamin.complaint.dto.request.ComplaintRegistRequest;
import com.saessakmaeul.bitamin.complaint.dto.response.ComplaintSimpleResponse;
import com.saessakmaeul.bitamin.complaint.dto.response.ComplatinDetailResponse;
import com.saessakmaeul.bitamin.complaint.service.ComplaintService;
import com.saessakmaeul.bitamin.util.jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("")
    public ResponseEntity<?> getComplaintList(@RequestHeader(name = "Authorization", required = false) String token){
        try{
            long userId =jwtUtil.extractUserId(token.substring(7));
            List<ComplaintSimpleResponse> responseList = complaintService.getComplaintList(userId);
            return ResponseEntity.ok(responseList);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getComplaintDetail(@RequestHeader(name = "Authorization", required = false) String token, @PathVariable(name = "id") long id) {
        try {
            long userId = jwtUtil.extractUserId(token.substring(7));
            ComplatinDetailResponse response = complaintService.getComplaintDetail(id, userId);
            return ResponseEntity.ok(response);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("")
    public ResponseEntity<?> postComplaint(@RequestHeader(name = "Authorization",required = false) String token, @RequestBody()ComplaintRegistRequest request) {
        try{
            long userId = jwtUtil.extractUserId(token.substring(7));
            complaintService.postComplaint(request,userId);
            return ResponseEntity.ok().build();
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/{stopDate}")
    public ResponseEntity<?> patchComplaint(@RequestHeader(name = "Authorization",required = false) String token, @PathVariable(name = "id") long id, @PathVariable(name = "stopDate") int stopDate){
        try{
            long userId = jwtUtil.extractUserId(token.substring(7));
            complaintService.patchComplaint(id,stopDate,userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
