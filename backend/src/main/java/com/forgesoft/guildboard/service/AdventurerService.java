package com.forgesoft.guildboard.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.forgesoft.guildboard.entity.Adventurer;
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
    
}
