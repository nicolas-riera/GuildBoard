package com.forgesoft.guildboard.controller;

import com.forgesoft.guildboard.dto.AdventurerResponse;
import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.dto.CreateAdventurerRequest;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.service.AdventurerService;
import com.forgesoft.guildboard.service.AssignmentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/adventurers")
public class AdventurerController {

    private final AdventurerService service;
    private final AssignmentService assignmentService;

    public AdventurerController(AdventurerService service, AssignmentService assignmentService) {
        this.service = service;
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<Adventurer> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Adventurer getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<AdventurerResponse> create(
            @Valid @RequestBody CreateAdventurerRequest request) {
        return new ResponseEntity<>(service.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Adventurer update(@PathVariable Long id, @RequestBody Adventurer adventurer) {
        return service.update(id, adventurer);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/history")
    public List<AssignmentResponse> getHistory(@PathVariable Long id) {
        return assignmentService.getHistoryForAdventurer(id);
    }
}