package com.forgesoft.guildboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forgesoft.guildboard.entity.Assignment;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByAdventurerId(Long adventurerId);

    boolean existsByAdventurerIdAndCompletedAtIsNull(Long adventurerId);

    Optional<Assignment> findByQuestIdAndCompletedAtIsNull(Long questId);
}