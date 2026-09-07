package com.forgesoft.guildboard.mapper;

import com.forgesoft.guildboard.dto.CreateQuestRequest;
import com.forgesoft.guildboard.dto.QuestResponse;
import com.forgesoft.guildboard.entity.Quest;
import org.springframework.stereotype.Component;

@Component
public class QuestMapper {

    public Quest toEntity(CreateQuestRequest request) {
        Quest quest = new Quest();
        quest.setTitle(request.title());
        quest.setDescription(request.description());
        quest.setDifficulty(request.difficulty());
        quest.setRequiredLevel(request.requiredLevel());
        quest.setGoldReward(request.goldReward());
        quest.setXpReward(request.xpReward());
        return quest;
    }

    public QuestResponse toResponse(Quest quest) {
        return new QuestResponse(
                quest.getId(),
                quest.getTitle(),
                quest.getDescription(),
                quest.getDifficulty(),
                quest.getRequiredLevel(),
                quest.getGoldReward(),
                quest.getXpReward(),
                quest.getStatus()
        );
    }
}