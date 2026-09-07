package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.enums.Difficulty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateQuestRequest(
        @NotBlank @Size(min = 5, max = 100) String title,
        @NotBlank @Size(min = 10, max = 500) String description,
        @NotNull Difficulty difficulty,
        @Min(1) int requiredLevel,
        @Min(0) int goldReward,
        @Min(0) int xpReward
) {}