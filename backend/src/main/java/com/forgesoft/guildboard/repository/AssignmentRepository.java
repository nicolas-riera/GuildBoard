package com.forgesoft.guildboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.forgesoft.guildboard.entity.Assignment;
import java.util.List;


public interface AssignmentRepository extends JpaRepository<Assignment, Long>{
    
    List<Assignment> findByAdventurerId(Long id);
}
