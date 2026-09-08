package com.forgesoft.guildboard.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.dto.CreateQuestRequest;
import com.forgesoft.guildboard.dto.UpdateQuestRequest;
import com.forgesoft.guildboard.dto.QuestResponse;
import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import com.forgesoft.guildboard.exception.BusinessRuleException;
import com.forgesoft.guildboard.exception.ResourceNotFoundException;
import com.forgesoft.guildboard.mapper.AssignmentMapper;
import com.forgesoft.guildboard.mapper.QuestMapper;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import com.forgesoft.guildboard.repository.QuestRepository;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuestMapper questMapper;
    private final AssignmentMapper assignmentMapper;

    public QuestService(QuestRepository questRepository,
                        AdventurerRepository adventurerRepository,
                        AssignmentRepository assignmentRepository,
                        QuestMapper questMapper,
                        AssignmentMapper assignmentMapper) {
        this.questRepository = questRepository;
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
        this.questMapper = questMapper;
        this.assignmentMapper = assignmentMapper;
    }

    @Transactional(readOnly = true)
    public List<QuestResponse> getAll(QuestStatus status, Difficulty difficulty) {
        List<Quest> quests;
        if (status != null && difficulty != null) {
            quests = questRepository.findByStatusAndDifficulty(status, difficulty);
        } else if (status != null) {
            quests = questRepository.findByStatus(status);
        } else if (difficulty != null) {
            quests = questRepository.findByDifficulty(difficulty);
        } else {
            quests = questRepository.findAll();
        }
        return quests.stream().map(questMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public QuestResponse getById(Long id) {
        return questMapper.toResponse(getEntityById(id));
    }

    @Transactional
    public QuestResponse create(CreateQuestRequest request) {
        Quest saved = questRepository.save(questMapper.toEntity(request));
        return questMapper.toResponse(saved);
    }

    @Transactional
    public QuestResponse update(Long id, UpdateQuestRequest request) {
        Quest quest = getEntityById(id);
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new BusinessRuleException("CANNOT_EDIT_QUEST", "Only available quests can be edited.");
        }
        quest.setTitle(request.title());
        quest.setDescription(request.description());
        quest.setDifficulty(request.difficulty());
        quest.setRequiredLevel(request.requiredLevel());
        quest.setGoldReward(request.goldReward());
        quest.setXpReward(request.xpReward());
        return questMapper.toResponse(quest);
    }

    @Transactional
    public void delete(Long id) {
        Quest quest = getEntityById(id);
        if (quest.getStatus() == QuestStatus.ON_GOING) {
            throw new BusinessRuleException("DELETE_ON_GOING_QUEST", "You can't delete an on going quest.");
        }
        questRepository.delete(quest);
    }

    @Transactional
    public AssignmentResponse assignQuest(Long questId, Long adventurerId) {
        Quest quest = getEntityById(questId);
        Adventurer adventurer = adventurerRepository.findById(adventurerId)
                .orElseThrow(() -> new ResourceNotFoundException("Adventurer not found"));

        // RG1 & RG2
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new BusinessRuleException("QUEST_NOT_AVAILABLE", "Quest not available.");
        }
        if (adventurer.getLevel() < quest.getRequiredLevel()) {
            throw new BusinessRuleException("INSUFFICIENT_ADVENTURER_LEVEL", "Insufficient adventurer level.");
        }
        if (assignmentRepository.existsByAdventurerIdAndCompletedAtIsNull(adventurerId)) {
            throw new BusinessRuleException("ADVENTURER_HAS_ON_GOING_QUEST", "Adventurer already has an on going quest.");
        }

        quest.setStatus(QuestStatus.ON_GOING);

        Assignment assignment = new Assignment();
        assignment.setQuest(quest);
        assignment.setAdventurer(adventurer);
        assignment.setAssignedAt(LocalDateTime.now());

        return assignmentMapper.toResponse(assignmentRepository.save(assignment));
    }

    @Transactional
    public AssignmentResponse completeQuest(Long questId) {
        Quest quest = getEntityById(questId);
        if (quest.getStatus() != QuestStatus.ON_GOING) {
            throw new BusinessRuleException("QUEST_NOT_ON_GOING", "You can't complete a quest that isn't on going.");
        }

        Assignment assignment = assignmentRepository.findByQuestIdAndCompletedAtIsNull(questId)
                .orElseThrow(() -> new ResourceNotFoundException("Active assignment not found for this quest."));

        Adventurer adventurer = assignment.getAdventurer();
        adventurer.setGold(adventurer.getGold() + quest.getGoldReward());
        adventurer.setXp(adventurer.getXp() + quest.getXpReward());

        // RG3
        while (adventurer.getXp() >= adventurer.getLevel() * 100) {
            adventurer.setXp(adventurer.getXp() - (adventurer.getLevel() * 100));
            adventurer.setLevel(adventurer.getLevel() + 1);
        }

        quest.setStatus(QuestStatus.COMPLETED);
        assignment.setCompletedAt(LocalDateTime.now());

        return assignmentMapper.toResponse(assignment);
    }

    private Quest getEntityById(Long id) {
        return questRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quest not found."));
    }
}
