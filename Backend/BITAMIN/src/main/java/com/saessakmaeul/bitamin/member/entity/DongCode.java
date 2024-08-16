package com.saessakmaeul.bitamin.member.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "dong_code")
public class DongCode {

    @Id
    @Column(name = "dong_code", length = 100)
    private String dongCode;

    @Column(name = "sido_name", nullable = false, length = 40)
    private String sidoName;

    @Column(name = "gugun_name", length = 40)
    private String gugunName;

    @Column(name = "dong_name", length = 40)
    private String dongName;

    @Column(name = "x_coordinate", length = 20)
    private String xCoordinate;

    @Column(name = "y_coordinate", length = 20)
    private String yCoordinate;

    @Column(name = "lat", length = 40)
    private String lat;

    @Column(name = "lng", length = 40)
    private String lng;

    // 관계 설정 (Member와 연결)
    @OneToMany(mappedBy = "dongCode", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Member> members;
}
