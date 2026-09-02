package com.forgesoft.guildboard.entity;

import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="\"Quest\"")
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 5, max = 100)
    @Column(name = "title", nullable = false, unique = true, length = 100)
    private String title;

    @NotBlank
    @Size(min = 10, max = 500)
    @Column(name = "description", nullable = false, unique = true, length = 500)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty", nullable = false)
    private Difficulty difficulty;

    @Min(1)
    @Column(name = "\"requiredLevel\"", nullable = false)
    private int requiredLevel;

    @Min(0)
    @Column(name = "\"goldReward\"", nullable = false)
    private int goldReward;

    @Min(0)
    @Column(name = "\"xpReward\"", nullable = false)
    private int xpReward;

    @NotNull
    @Enumerated(EnumType.STRING)
    private QuestStatus status = QuestStatus.AVALAIBLE;

    // Getters and setters
}
