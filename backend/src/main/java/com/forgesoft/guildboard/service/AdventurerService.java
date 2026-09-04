package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.CreateAdventurerRequest;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.mapper.AdventurerMapper;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdventurerService {

    private final AdventurerRepository repository;
    private final AdventurerMapper mapper;

    public AdventurerService(AdventurerRepository repository, AdventurerMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Transactional
    public AdventurerResponse create(CreateAdventurerRequest request) {
        if (repository.existsByName(request.name())) {
            throw new BusinessRuleException("NAME_ALREADY_TAKEN",
                    "An adventurer named " + request.name() + " already exists");
        }
        Adventurer saved = repository.save(mapper.toEntity(request));
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<Adventurer> getAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Adventurer getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Adventurer not found: " + id));
    }

    @Transactional
    public Adventurer update(Long id, Adventurer adventurer) {
        Adventurer existing = getById(id);
        existing.setName(adventurer.getName());
        existing.setCharacterClass(adventurer.getCharacterClass());
        existing.setLevel(adventurer.getLevel());
        existing.setXp(adventurer.getXp());
        existing.setGold(adventurer.getGold());
        return existing;
    }

    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Adventurer not found: " + id);
        }
        repository.deleteById(id);
    }
}