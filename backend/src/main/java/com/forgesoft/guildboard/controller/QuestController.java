package com.forgesoft.guildboard.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import com.forgesoft.guildboard.service.QuestService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;

@RestController
@RequestMapping("/api/quests")
public class QuestController {
    private final QuestService service;

    public QuestController(QuestService service) {
        this.service = service;
    }

    @GetMapping
    public List<Quest> getAll(@RequestParam(required = false) QuestStatus status,
                               @RequestParam(required = false) Difficulty difficulty) {
        return service.getAll(status, difficulty);
    }

    @GetMapping("/{id}")
    public Quest getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<Quest> create(@RequestBody Quest quest) {
        return new ResponseEntity<>(service.create(quest), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public Quest update(@PathVariable Long id, @RequestBody Quest quest) {
        return service.update(id, quest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assignment")
    public Assignment assign(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        Long adventurerId = payload.get("adventurerId");
        return service.assignQuest(id, adventurerId);
    }

    @PostMapping("/{id}/completion")
    public Assignment complete(@PathVariable Long id) {
        return service.completeQuest(id);
    }
}
