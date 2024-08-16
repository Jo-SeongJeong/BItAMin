package com.saessakmaeul.bitamin.complaint.service;

import com.saessakmaeul.bitamin.complaint.dto.request.ComplaintRegistRequest;
import com.saessakmaeul.bitamin.complaint.dto.response.ComplaintSimpleResponse;
import com.saessakmaeul.bitamin.complaint.dto.response.ComplatinDetailResponse;
import com.saessakmaeul.bitamin.complaint.entity.Complaint;
import com.saessakmaeul.bitamin.complaint.entity.UserStop;
import com.saessakmaeul.bitamin.complaint.repository.ComplaintRepository;
import com.saessakmaeul.bitamin.complaint.repository.UserStopRepository;
import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.entity.Role;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.message.dto.request.MessageRegistRequest;
import com.saessakmaeul.bitamin.message.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.rmi.server.ExportException;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserStopRepository userStopRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MessageService messageService;

    public List<ComplaintSimpleResponse> getComplaintList(long userId) throws Exception{
        checkAdmin(userId);
        List<Complaint> complaintList = complaintRepository.findAll();
        List<ComplaintSimpleResponse> result = new ArrayList<>();
        for(Complaint complaint : complaintList){
            if(complaint.getIsResolved()) continue;
            ComplaintSimpleResponse response = ComplaintSimpleResponse.builder()
                    .id(complaint.getId())
                    .respondentNickname(getNickName(complaint.getRespondentId()))
                    .complainantNickname(getNickName(complaint.getComplainantId()))
                    .sendDate(complaint.getSendDate())
                    .type(complaint.getType())
                    .build();
            result.add(response);
        }
        Collections.sort(result,(o1,o2)->o2.getSendDate().compareTo(o1.getSendDate()));
        return result;
    }

    public ComplatinDetailResponse getComplaintDetail(long id, long userId) throws Exception{
        checkAdmin(userId);
        Complaint response = complaintRepository.findById(id).orElseThrow(()->new Exception("해당 id를 가진 신고가 없습니다."));
        // 정지 남은 일수
        int remainStopDate = 0;
        // 피신고자 현재 정지 기간 계산
        try{
            // 피신고자가 정지를 당해있는 경우
            UserStop userStop = userStopRepository.findById(response.getRespondentId()).orElseThrow(Exception::new);
            LocalDateTime stopDate = userStop.getStopDate();
            remainStopDate = (int) ChronoUnit.DAYS.between(LocalDateTime.now(),stopDate);
        } catch (ExportException e){
            // 피신고자가 정지를 안 당해있는 경우
            remainStopDate = 0;
        } finally {
            // 역대 피신고자 정지 기간 및 횟수
            int judgementCount = 0;
            int judgementDate = 0;
            List<Complaint> complaintList = complaintRepository.findAllByRespondentId(response.getRespondentId());
            for(Complaint complaint : complaintList){
                if(!complaint.getIsResolved()) continue;
                judgementCount++;
                judgementDate += complaint.getJudgement();
            }

            ComplatinDetailResponse result = ComplatinDetailResponse.builder()
                    .id(id)
                    .respondentNickname(getNickName(response.getRespondentId()))
                    .complainantNickname(getNickName(response.getComplainantId()))
                    .content(response.getContent())
                    .category(response.getCategory())
                    .sendDate(response.getSendDate())
                    .stopDate(remainStopDate)
                    .judgementCount(judgementCount)
                    .judgementDate(judgementDate)
                    .build();
            return result;
        }
    }

    @Transactional
    public Complaint postComplaint(ComplaintRegistRequest request, long userId) throws Exception{
        Complaint complaint = new Complaint();
        complaint.setComplainantId(userId);
        complaint.setRespondentId(request.getRespondentId());
        complaint.setCategory(request.getCategory());
        complaint.setContent(request.getContent());
        complaint.setType(request.getType());
        complaint.setIsResolved(false);
        complaint.setJudgement(0);
        complaint.setSendDate(LocalDateTime.now());
        return complaintRepository.save(complaint);
    }

    @Transactional
    public void patchComplaint(long id, int stopDate, long userId) throws Exception {
        checkAdmin(userId);
        Complaint complaint = complaintRepository.findById(id).orElseThrow(()->new Exception("해당 id를 가진 신고가 없습니다."));
        if(complaint.getIsResolved()) throw new Exception("이미 처리된 신고 입니다.");
        complaint.setJudgement(stopDate);
        complaint.setIsResolved(true);
        complaintRepository.save(complaint);
        try{
            UserStop userStop = userStopRepository.findById(complaint.getRespondentId()).orElseThrow(Exception::new);
            userStop.setStopDate(userStop.getStopDate().plusDays(stopDate));
            userStopRepository.save(userStop);
        } catch (Exception e) {
            UserStop userStop = new UserStop();
            userStop.setId(complaint.getRespondentId());
            userStop.setStopDate(LocalDateTime.now().plusDays(stopDate));
            userStopRepository.save(userStop);
        } finally {
            // 보낼 메시지 생성 (신고자)
            MessageRegistRequest messageToComplaint = MessageRegistRequest.builder()
                    .title("신고 처리 완료")
                    .content(getNickName(complaint.getRespondentId())+"의 재제를  완료하였습니다.")
                    .category("신고")
                    .counselingDate(LocalDateTime.now())
                    .receiverId(complaint.getComplainantId())
                    .build();

            // 보낼 메시지 생성 (피신고자)
            MessageRegistRequest messageToRespondent = MessageRegistRequest.builder()
                    .title("재제 알림")
                    .content(getNickName(complaint.getRespondentId())+"님의 계정이 "+ stopDate +"일간 정지 당하셨습니다.")
                    .category("신고")
                    .counselingDate(LocalDateTime.now())
                    .receiverId(complaint.getRespondentId())
                    .build();
            // 메시지 전송
            messageService.registMessage(messageToComplaint,userId);
            messageService.registMessage(messageToRespondent,userId);
        }
    }

    private String getNickName(long userId) throws Exception {
        return memberRepository.findById(userId).orElseThrow(Exception::new).getNickname();
    }

    private void checkAdmin(long userId) throws Exception {
        Member member =  memberRepository.findById(userId).orElseThrow(() -> new Exception("해당 id를 가진 멤버가 존재하지 않습니다."));
        if(!member.getRole().equals(Role.ROLE_ADMIN)) throw new Exception("admin이 아닙니다.");
    }
}
