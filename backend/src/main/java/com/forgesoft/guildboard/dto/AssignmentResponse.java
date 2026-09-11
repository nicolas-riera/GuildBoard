package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.enums.Difficulty;
import java.time.LocalDateTime;

public record AssignmentResponse(
        Long id,
        Long questId,
        String questTitle,
        Difficulty questDifficulty,
        int goldReward,
        int xpReward,
        LocalDateTime assignedAt,
        LocalDateTime completedAt
) {}