package com.saessakmaeul.bitamin.mission.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "mission")
@Getter
@Setter
public class Mission{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "mission_name", nullable = false)
    private String missionName;

    @Column(name = "mission_description", nullable = false)
    private String missionDescription;

    @Column(name = "mission_level", nullable = false)
    private int missionLevel;
}