package com.forgesoft.guildboard.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.dto.CreateQuestRequest;
import com.forgesoft.guildboard.dto.UpdateQuestRequest;
import com.forgesoft.guildboard.dto.QuestAssignmentRequest;
import com.forgesoft.guildboard.dto.QuestResponse;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import com.forgesoft.guildboard.service.QuestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService service;

    public QuestController(QuestService service) {
        this.service = service;
    }

    @GetMapping
    public List<QuestResponse> getAll(@RequestParam(required = false) QuestStatus status,
                                      @RequestParam(required = false) Difficulty difficulty) {
        return service.getAll(status, difficulty);
    }

    @GetMapping("/{id}")
    public QuestResponse getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<QuestResponse> create(@Valid @RequestBody CreateQuestRequest request) {
        return new ResponseEntity<>(service.create(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public QuestResponse update(@PathVariable Long id, @Valid @RequestBody UpdateQuestRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/assignment")
    public ResponseEntity<AssignmentResponse> assign(@PathVariable Long id,
        @Valid @RequestBody QuestAssignmentRequest request) {
        return new ResponseEntity<>(service.assignQuest(id, request.adventurerId()), HttpStatus.CREATED);
    }

    @PostMapping("/{id}/completion")
    public AssignmentResponse complete(@PathVariable Long id) {
        return service.completeQuest(id);
    }
}