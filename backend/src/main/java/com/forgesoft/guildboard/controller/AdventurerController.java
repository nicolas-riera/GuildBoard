package com.forgesoft.guildboard.controller;

import org.springframework.web.bind.annotation.RestController;

import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.service.AdventurerService;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/adventurers/")
public class AdventurerController {

    private final AdventurerService service;

    public AdventurerController(AdventurerService service) {
        this.service = service;
    }

    @GetMapping("path")
    public List<Adventurer> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Adventurer getById(@PathVariable Long id) {
        return service.getById(id);
    }
    
    @PostMapping
    public ResponseEntity<Adventurer> create(@RequestBody Adventurer adventurer) {
        return new ResponseEntity<>(service.create(adventurer), HttpStatus.CREATED);
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
    public List<Assignment> getHistory(@PathVariable Long id) {
        return service.getHistory(id);
    }
    
}
