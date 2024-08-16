package com.saessakmaeul.bitamin.message.service;

import com.saessakmaeul.bitamin.member.entity.Member;
import com.saessakmaeul.bitamin.member.repository.MemberRepository;
import com.saessakmaeul.bitamin.message.dto.request.MessageRegistRequest;
import com.saessakmaeul.bitamin.message.dto.request.ReplyRegistRequest;
import com.saessakmaeul.bitamin.message.dto.response.MessageDetailResponse;
import com.saessakmaeul.bitamin.message.dto.response.MessageSimpleResponse;
import com.saessakmaeul.bitamin.message.dto.response.Replies;
import com.saessakmaeul.bitamin.message.entity.Message;
import com.saessakmaeul.bitamin.message.entity.Reply;
import com.saessakmaeul.bitamin.message.repository.MessageRepository;
import com.saessakmaeul.bitamin.message.repository.ReplyRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class MessageService {
    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ReplyRepository replyRepository;

    @Autowired
    private MemberRepository memberRepository;

    public List<MessageSimpleResponse> getAllMessages(long userId) throws Exception{
        List<MessageSimpleResponse> result = new ArrayList<>();
        // 내가 수신자인 경우
        List<Message> messages = messageRepository.findByReceiverId(userId);
        for (Message message : messages) {
            if(message.getIsDeleted()==2) continue;
            Member member = memberRepository.findById(message.getSenderId()).orElseThrow(Exception::new);
            MessageSimpleResponse dto = MessageSimpleResponse.builder()
                    .id(message.getId())
                    .nickname(member.getNickname())
                    .category(message.getCategory())
                    .title(message.getTitle())
                    .sendDate(message.getSendDate())
                    .isRead(message.getIsRead())
                    .url(member.getProfileUrl())
                    .build();
            result.add(dto);
        }

        // 내가 송신자인 경우
        messages = messageRepository.findBySenderId(userId);
        for (Message message : messages) {
            if(message.getIsDeleted()==1) continue;
            Member member = memberRepository.findById(message.getReceiverId()).orElseThrow(Exception::new);
            MessageSimpleResponse dto = MessageSimpleResponse.builder()
                    .id(message.getId())
                    .nickname(member.getNickname())
                    .category(message.getCategory())
                    .title(message.getTitle())
                    .sendDate(message.getSendDate())
                    .isRead(message.getIsRead())
                    .url(member.getProfileUrl())
                    .build();
            result.add(dto);
        }
        Collections.sort(result,(o1,o2)->o2.getSendDate().compareTo(o1.getSendDate()));
        return result;
    }

    public MessageDetailResponse getMessageDetail(long id,long userId) throws Exception{
        Message message = messageRepository.findById(id).orElseThrow(()->new Exception("해당 id를 가진 메시지가 없습니다."));
        String nickname = null;
        Long opponentId = null;
        String url = null;
        // 유저가 송신자인 경우
        if(userId == message.getSenderId()){
            Member member = memberRepository.findById(message.getReceiverId()).orElseThrow(()->new Exception("존재하지 않는 reciever 입니다."));
            nickname = member.getNickname();
            opponentId = member.getId();
            url = member.getProfileUrl();
        }
        // 유저가 수신자인 경우
        else {
            Member member = memberRepository.findById(message.getSenderId()).orElseThrow(()->new Exception("존재하지 않는 sender 입니다."));
            nickname = member.getNickname();
            opponentId = member.getId();
            url = member.getProfileUrl();
        }
        // 답장 조회
        List<Reply> replies = replyRepository.findByMessageId(id);

        // 답장 리스트 정제
        List<Replies> repliyList = new ArrayList<>();
        for(Reply reply : replies){
            if(reply.getIsDeleted()==1 && reply.getMemberId()==userId) continue;
            if(reply.getIsDeleted()==2 && reply.getMemberId()!=userId) continue;
            Member member = memberRepository.findById(reply.getMemberId()).orElseThrow(Exception::new);
            Replies temp = Replies
                    .builder()
                    .id(reply.getId())
                    .memberNickName(member.getNickname())
                    .content(reply.getContent())
                    .isRead(reply.getIsRead())
                    .sendDate(reply.getSendDate())
                    .url(member.getProfileUrl())
                    .build();
            repliyList.add(temp);
        }
        Collections.sort(repliyList,(o1,o2)->o1.getSendDate().compareTo(o2.getSendDate()));

        MessageDetailResponse result = MessageDetailResponse.builder()
                .id(id)
                .nickname(nickname)
                .opponentId(opponentId)
                .category(message.getCategory())
                .title(message.getTitle())
                .content(message.getContent())
                .sendDate(message.getSendDate())
                .counselingDate(message.getCounselingDate())
                .isRead(message.getIsRead())
                .url(url)
                .replies(repliyList)
                .build();
        return result;
    }

    @Transactional
    public Message registMessage(MessageRegistRequest message,Long userId) throws Exception{
        memberRepository.findById(message.getReceiverId()).orElseThrow(()->new Exception("reciever가 존재하지 않습니다."));
        Message registMessage = new Message();
        registMessage.setSenderId(userId);
        registMessage.setReceiverId(message.getReceiverId());
        registMessage.setCategory(message.getCategory());
        registMessage.setTitle(message.getTitle());
        registMessage.setContent(message.getContent());
        registMessage.setIsDeleted(0);
        registMessage.setIsRead(false);
        registMessage.setCounselingDate(message.getCounselingDate());
        registMessage.setSendDate(LocalDateTime.now());
        return messageRepository.save(registMessage);
    }

    @Transactional
    public Reply registReply(ReplyRegistRequest reply, Long id, Long userId) throws Exception{
        Message message = messageRepository.findById(id).orElseThrow(()->new Exception("해당 id의 메시지가 없습니다."));
        Reply registReply = new Reply();
        registReply.setMessageId(id);
        registReply.setMemberId(userId);
        registReply.setContent(reply.getContent());
        registReply.setIsDeleted(0);
        registReply.setIsRead(false);
        registReply.setSendDate(LocalDateTime.now());
        message.setSendDate(registReply.getSendDate());
        messageRepository.save(message);
        return replyRepository.save(registReply);
    }

    @Transactional
    public Message deleteMessage(Long id, Long userId) throws Exception{
        Message message = messageRepository.findById(id).orElseThrow(()->new Exception("해당 id의 메시지가 없습니다."));
        // user가 sender 인 경우 2이면 제거, 0이면 1로 변경
        if(message.getSenderId() == userId) {
            if(message.getIsDeleted()==2) {
                messageRepository.delete(message);
                return message;
            }
                message.setIsDeleted(1);
                return messageRepository.save(message);
        }
        // reciever인 경우 1이면 제거 0이면 2로 변경
        if(message.getIsDeleted()==1) {
            messageRepository.delete(message);
            return message;
        }
        message.setIsDeleted(2);
        return messageRepository.save(message);
    }

    @Transactional
    public Reply deleteReply(Long id, Long userId) throws Exception{
        Reply reply = replyRepository.findById(id).orElseThrow(()->new Exception("해당 id의 답장이 없습니다."));
        // user가 sender 인 경우 2이면 제거, 0이면 1로 변경
        if(reply.getMemberId() == userId) {
            if(reply.getIsDeleted()==2) {
                replyRepository.delete(reply);
                return reply;
            }
            reply.setIsDeleted(1);
            return replyRepository.save(reply);
        }
        // reciever인 경우 1이면 제거 0이면 2로 변경
        if(reply.getIsDeleted()==1) {
            replyRepository.delete(reply);
            return reply;
        }
        reply.setIsDeleted(2);
        return replyRepository.save(reply);
    }
}
