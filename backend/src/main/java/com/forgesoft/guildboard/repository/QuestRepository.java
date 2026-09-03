package com.forgesoft.guildboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.forgesoft.guildboard.entity.Quest;

public interface QuestRepository extends JpaRepository<Quest, Long> {
    
}
