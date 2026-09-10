package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.CreateAdventurerRequest;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.enums.CharacterClass;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.mapper.AdventurerMapper;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class AdventurerServiceTest {

    @Mock
    private AdventurerRepository repository;

    @Mock
    private AdventurerMapper mapper;

    @InjectMocks
    private AdventurerService adventurerService;

    @Test
    @DisplayName("Should create an Adventurer if the name is avalaible")
    void create_ShouldCreateAdventurer_WhenNameIsNotTaken() {
        
        CreateAdventurerRequest request = new CreateAdventurerRequest("Aragorn", CharacterClass.WARRIOR);
        Adventurer entity = new Adventurer();
        Adventurer savedEntity = new Adventurer();
        AdventurerResponse response = new AdventurerResponse(1L, "Aragorn", CharacterClass.WARRIOR, 1, 0, 100);

        given(repository.existsByName("Aragorn")).willReturn(false);
        given(mapper.toEntity(request)).willReturn(entity);
        given(repository.save(entity)).willReturn(savedEntity);
        given(mapper.toResponse(savedEntity)).willReturn(response);

        AdventurerResponse result = adventurerService.create(request);

        assertThat(result).isNotNull();
        assertThat(result.name()).isEqualTo("Aragorn");
        verify(repository).save(entity);
    }

    @Test
    @DisplayName("Should thrown an exception if the name already exists")
    void create_ShouldThrowException_WhenNameAlreadyExists() {

        CreateAdventurerRequest request = new CreateAdventurerRequest("Aragorn", CharacterClass.WARRIOR);
        given(repository.existsByName("Aragorn")).willReturn(true);

        assertThatThrownBy(() -> adventurerService.create(request))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessageContaining("already exists");
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException if adventurer doesn't exist")
    void getById_ShouldThrowException_WhenNotFound() {

        given(repository.findById(99L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> adventurerService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}