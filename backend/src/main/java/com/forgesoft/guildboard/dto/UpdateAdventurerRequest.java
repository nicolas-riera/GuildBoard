package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.enums.CharacterClass;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateAdventurerRequest(
        @NotBlank @Size(min = 2, max = 50) String name,
        @NotNull CharacterClass characterClass,
        @Min(1) int level,
        @Min(0) int xp,
        @Min(0) int gold
) {}