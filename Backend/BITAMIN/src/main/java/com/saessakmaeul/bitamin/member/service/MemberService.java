package com.saessakmaeul.bitamin.member.service;

import com.saessakmaeul.bitamin.member.dto.MemberDTO;
import com.saessakmaeul.bitamin.member.entity.Member;

import java.util.List;
import java.util.Optional;

public interface MemberService {
    Long register(MemberDTO memberDTO);
    Optional<Member> getMember(String email);
    List<MemberDTO> getMemberList();
}
