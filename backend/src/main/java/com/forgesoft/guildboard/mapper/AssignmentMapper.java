package com.forgesoft.guildboard.mapper;

import com.forgesoft.guildboard.dto.AssignmentResponse;
import com.forgesoft.guildboard.entity.Assignment;
import com.forgesoft.guildboard.entity.Quest;
import org.springframework.stereotype.Component;

@Component
public class AssignmentMapper {

    public AssignmentResponse toResponse(Assignment assignment) {
        Quest quest = assignment.getQuest();
        return new AssignmentResponse(
                assignment.getId(),
                quest.getId(),
                quest.getTitle(),
                quest.getDifficulty(),
                quest.getGoldReward(),
                quest.getXpReward(),
                assignment.getAssignedAt(),
                assignment.getCompletedAt()
        );
    }
}