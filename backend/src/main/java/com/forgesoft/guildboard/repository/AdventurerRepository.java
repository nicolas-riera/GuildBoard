package com.forgesoft.guildboard.repository;

import com.forgesoft.guildboard.entity.Adventurer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdventurerRepository extends JpaRepository<Adventurer, Long> {
    boolean existsByName(String name);
}