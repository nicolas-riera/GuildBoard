package com.forgesoft.guildboard.dto;

import com.forgesoft.guildboard.enums.CharacterClass;

public record AdventurerResponse(
        Long id,
        String name,
        CharacterClass characterClass,
        int level,
        int xp,
        int gold
) {}