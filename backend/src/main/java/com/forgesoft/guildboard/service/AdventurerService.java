package com.forgesoft.guildboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;

@Service
public class AdventurerService {

    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository;

    public AdventurerService(AdventurerRepository adventurerRepository, AssignmentRepository assignmentRepository) {
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<Adventurer> getAll() {
        return adventurerRepository.findAll();
    }

    public Adventurer getById(Long id) {
        return adventurerRepository.findById(id)
            .orElseThrow (() -> new ResourceNotFoundException("Adventurer not found."));
    }

    public Adventurer create(Adventurer adventurer) {
        return adventurerRepository.save(adventurer);
    }

    public Adventurer update(Long id, Adventurer updated) {
        Adventurer adventurer = getById(id);
        adventurer.setName(updated.getName());
        adventurer.setCharacterClass(updated.getCharacterClass());
        return adventurerRepository.save(adventurer);
    }

    public void delete(Long id) {
        adventurerRepository.deleteById(id);
    }

    public List<Assignment> getHistory(Long id) {
        getById(id); // Check if Adventurer exists
        return assignmentRepository.findByAdventurerId(id);
    }
    
}
