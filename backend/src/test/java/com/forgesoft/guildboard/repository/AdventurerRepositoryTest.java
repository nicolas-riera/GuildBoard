package com.forgesoft.guildboard.repository;

import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.enums.CharacterClass;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class AdventurerRepositoryTest {

    @Autowired
    private AdventurerRepository adventurerRepository;

    @Test
    void existsByName_ShouldReturnTrue_WhenAdventurerExists() {
        Adventurer adventurer = new Adventurer();
        adventurer.setName("Geralt");
        adventurer.setCharacterClass(CharacterClass.WARRIOR);
        adventurerRepository.save(adventurer);

        boolean exists = adventurerRepository.existsByName("Geralt");

        assertThat(exists).isTrue();
    }

    @Test
    void existsByName_ShouldReturnFalse_WhenAdventurerDoesNotExist() {
        boolean exists = adventurerRepository.existsByName("Unknown");

        assertThat(exists).isFalse();
    }
}