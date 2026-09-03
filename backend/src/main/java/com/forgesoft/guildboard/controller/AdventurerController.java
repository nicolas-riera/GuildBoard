package com.forgesoft.guildboard.controller;

import org.springframework.web.bind.annotation.RestController;

import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.service.AdventurerService;

import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;

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
    
    
}
