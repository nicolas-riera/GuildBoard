package com.forgesoft.guildboard.repository;

import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class QuestRepositoryTest {

    @Autowired
    private QuestRepository questRepository;

    @Test
    void findByStatusAndDifficulty_ShouldReturnMatchingQuests() {
        Quest quest = new Quest();
        quest.setTitle("Chase the wolf");
        quest.setDescription("Kill 5 wild wolfs in the forest");
        quest.setDifficulty(Difficulty.EASY);
        quest.setRequiredLevel(1);
        quest.setGoldReward(100);
        quest.setXpReward(50);
        quest.setStatus(QuestStatus.AVAILABLE);
        questRepository.save(quest);

        List<Quest> result = questRepository.findByStatusAndDifficulty(QuestStatus.AVAILABLE, Difficulty.EASY);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Chase the wolf");
    }

    @Test
    void findByStatus_ShouldReturnQuestsWithGivenStatus() {
        Quest quest = new Quest();
        quest.setTitle("Clear the dungeon");
        quest.setDescription("Kill all the goblins of the dungeon");
        quest.setDifficulty(Difficulty.MEDIUM);
        quest.setRequiredLevel(3);
        quest.setGoldReward(300);
        quest.setXpReward(150);
        quest.setStatus(QuestStatus.AVAILABLE);
        questRepository.save(quest);

        List<Quest> result = questRepository.findByStatus(QuestStatus.AVAILABLE);

        assertThat(result).isNotEmpty();
        assertThat(result).allMatch(q -> q.getStatus() == QuestStatus.AVAILABLE);
    }

    @Test
    void findByDifficulty_ShouldReturnQuestsWithGivenDifficulty() {
        Quest quest = new Quest();
        quest.setTitle("Kill the dragon");
        quest.setDescription("Fight the red dragon on the red mountain");
        quest.setDifficulty(Difficulty.HARD);
        quest.setRequiredLevel(10);
        quest.setGoldReward(1000);
        quest.setXpReward(500);
        quest.setStatus(QuestStatus.AVAILABLE);
        questRepository.save(quest);

        List<Quest> result = questRepository.findByDifficulty(Difficulty.HARD);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDifficulty()).isEqualTo(Difficulty.HARD);
    }
}