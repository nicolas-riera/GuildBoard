package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;

public record QuestResponse(
        Long id,
        String title,
        String description,
        Difficulty difficulty,
        int requiredLevel,
        int goldReward,
        int xpReward,
        QuestStatus status
) {}