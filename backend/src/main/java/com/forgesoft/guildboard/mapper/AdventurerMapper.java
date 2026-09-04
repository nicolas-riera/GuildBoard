package com.forgesoft.guildboard.mapper;

import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.CreateAdventurerRequest;
import com.forgesoft.guildboard.entity.Adventurer;
import org.springframework.stereotype.Component;

@Component
public class AdventurerMapper {

    public Adventurer toEntity(CreateAdventurerRequest request) {
        Adventurer adventurer = new Adventurer();
        adventurer.setName(request.name());
        adventurer.setCharacterClass(request.characterClass());
        return adventurer;
    }

    public AdventurerResponse toResponse(Adventurer adventurer) {
        return new AdventurerResponse(
                adventurer.getId(),
                adventurer.getName(),
                adventurer.getCharacterClass(),
                adventurer.getLevel(),
                adventurer.getXp(),
                adventurer.getGold()
        );
    }
}