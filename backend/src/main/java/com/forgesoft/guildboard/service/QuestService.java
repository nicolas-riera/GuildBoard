package com.forgesoft.guildboard.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.forgesoft.guildboard.entity.Adventurer;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import com.forgesoft.guildboard.repository.AdventurerRepository;
import com.forgesoft.guildboard.repository.AssignmentRepository;
import com.forgesoft.guildboard.repository.QuestRepository;

@Service
public class QuestService {
    private final QuestRepository questRepository;
    private final AdventurerRepository adventurerRepository;
    private final AssignmentRepository assignmentRepository;

    public QuestService(QuestRepository questRepository, AdventurerRepository adventurerRepository, AssignmentRepository assignmentRepository) {
        this.questRepository = questRepository;
        this.adventurerRepository = adventurerRepository;
        this.assignmentRepository = assignmentRepository;
    }

    public List<Quest> getAll(QuestStatus status, Difficulty difficulty) {
        if (status != null && difficulty != null) return questRepository.findByStatusAndDifficulty(status, difficulty);
        if (status != null) return questRepository.findByStatus(status);
        if (difficulty != null) return questRepository.findByDifficulty(difficulty);
        return questRepository.findAll();
    }

    public Quest getById(Long id) {
        return questRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quest not found."));
    }

    public Quest create(Quest quest) {
        quest.setStatus(QuestStatus.AVAILABLE);
        return questRepository.save(quest);
    }

    public Quest update(Long id, Quest updated) {
        Quest quest = getById(id);
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new IllegalStateException("You can't edit an on going quest.");
        }
        quest.setTitle(updated.getTitle());
        quest.setDescription(updated.getDescription());
        quest.setDifficulty(updated.getDifficulty());
        quest.setRequiredLevel(updated.getRequiredLevel());
        quest.setGoldReward(updated.getGoldReward());
        quest.setXpReward(updated.getXpReward());
        return questRepository.save(quest);
    }

    public void delete(Long id) {
        Quest quest = getById(id);
        if (quest.getStatus() == QuestStatus.ON_GOING) {
            throw new IllegalStateException("You can't delete an on going quest.");
        }
        questRepository.delete(quest);
    }

    public Assignment assignQuest(Long questId, Long adventurerId) {
        Quest quest = getById(questId);
        Adventurer adventurer = adventurerRepository.findById(adventurerId)
                .orElseThrow(() -> new RuntimeException("Aventurier non trouvé"));

        // RG1 & RG2
        if (quest.getStatus() != QuestStatus.AVAILABLE) {
            throw new IllegalStateException("Quest not available.");
        }
        if (adventurer.getLevel() < quest.getRequiredLevel()) {
            throw new IllegalArgumentException("Insuffisant adventurer level.");
        }
        if (assignmentRepository.existsByAdventurerIdAndCompletedAtIsNull(adventurerId)) {
            throw new IllegalStateException("Adventurer already has an on going quest.");
        }

        quest.setStatus(QuestStatus.ON_GOING);
        questRepository.save(quest);

        Assignment assignment = new Assignment();
        assignment.setQuest(quest);
        assignment.setAdventurer(adventurer);
        assignment.setAssignedAt(LocalDateTime.now());
        return assignmentRepository.save(assignment);
    }

    public Assignment completeQuest(Long questId) {
        Quest quest = getById(questId);
        if (quest.getStatus() != QuestStatus.ON_GOING) {
            throw new IllegalStateException("You can't complete a quest that isn't on going.");
        }

        Assignment assignment = assignmentRepository.findByQuestIdAndCompletedAtIsNull(questId)
                .orElseThrow(() -> new RuntimeException("Active assignation not found for this quest."));

        Adventurer adventurer = assignment.getAdventurer();

        adventurer.setGold(adventurer.getGold() + quest.getGoldReward());
        adventurer.setXp(adventurer.getXp() + quest.getXpReward());
        
        // RG3 
        while (adventurer.getXp() >= adventurer.getLevel() * 100) {
            adventurer.setXp(adventurer.getXp() - (adventurer.getLevel() * 100));
            adventurer.setLevel(adventurer.getLevel() + 1);
        }

        adventurerRepository.save(adventurer);

        quest.setStatus(QuestStatus.COMPLETED);
        questRepository.save(quest);

        assignment.setCompletedAt(LocalDateTime.now());
        return assignmentRepository.save(assignment);
    }
}

