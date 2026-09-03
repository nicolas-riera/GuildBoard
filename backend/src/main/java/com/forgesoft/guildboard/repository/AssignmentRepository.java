package com.forgesoft.guildboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.forgesoft.guildboard.entity.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Long>{
    
}
