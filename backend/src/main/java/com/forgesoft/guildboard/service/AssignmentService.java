package com.forgesoft.guildboard.service;

import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.mapper.AssignmentMapper;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository repository;
    private final AssignmentMapper mapper;
    private final AdventurerRepository adventurerRepository;

    public AssignmentService(AssignmentRepository repository,
            AssignmentMapper mapper,
            AdventurerRepository adventurerRepository) {
        this.repository = repository;
        this.mapper = mapper;
        this.adventurerRepository = adventurerRepository;
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getHistoryForAdventurer(Long adventurerId) {
        if (!adventurerRepository.existsById(adventurerId)) {
            throw new ResourceNotFoundException("Adventurer not found: " + adventurerId);
        }
        return repository.findByAdventurerId(adventurerId).stream()
                .map(mapper::toResponse)
                .toList();
    }
}