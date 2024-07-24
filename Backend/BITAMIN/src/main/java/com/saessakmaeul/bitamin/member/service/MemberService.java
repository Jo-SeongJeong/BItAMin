package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.response.MemberResponseDTO;
import com.saessakmaeul.bitamin.member.entity.Member;

import java.util.List;
import java.util.Optional;

public interface MemberService {
    Long register(MemberResponseDTO memberDTO);
    Optional<Member> getMember(String email);
    List<MemberResponseDTO> getMemberList();
}
