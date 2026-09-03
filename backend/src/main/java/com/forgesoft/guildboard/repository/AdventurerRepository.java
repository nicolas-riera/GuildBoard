package com.forgesoft.guildboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.forgesoft.guildboard.entity.Adventurer;

public interface AdventurerRepository extends JpaRepository<Adventurer, Long> {

    
}