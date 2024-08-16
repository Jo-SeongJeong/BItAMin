package com.saessakmaeul.bitamin.mission.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "user_experience")
@Getter
@Setter
public class UserExperience {
    @Id
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "experience")
    private int experience;
}
