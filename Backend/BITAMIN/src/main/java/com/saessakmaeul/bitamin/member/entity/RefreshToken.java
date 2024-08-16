package com.saessakmaeul.bitamin.member.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "refresh_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefreshToken {
    @Id
    private Long id;

    @Column(name = "refresh_token")
    private String token;

    @Column(name = "expire_date")
    private LocalDateTime expireDate;

    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    private Member user;
}
