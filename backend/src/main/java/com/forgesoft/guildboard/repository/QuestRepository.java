package com.forgesoft.guildboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.forgesoft.guildboard.entity.Quest;
import com.forgesoft.guildboard.enums.Difficulty;
import com.forgesoft.guildboard.enums.QuestStatus;

public interface QuestRepository extends JpaRepository<Quest, Long> {

    List<Quest> findByStatusAndDifficulty(QuestStatus status, Difficulty difficulty);

    List<Quest> findByStatus(QuestStatus status);

	List<Quest> findByDifficulty(Difficulty difficulty);
    
}
