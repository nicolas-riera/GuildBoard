package com.forgesoft.guildboard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name="\"Assignment\"")
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    

    @ManyToOne
    @JoinColumn(name = "adventurer", nullable = false)
    private Adventurer adventurer;

    @ManyToOne
    @JoinColumn(name = "quest", nullable = false)
    private Quest quest;

    @Column(name = "\"assignedAt\"", nullable = false)
    private LocalDateTime assignedAt;

    @Column(name = "\"completedAt\"")
    private LocalDateTime completedAt;

    // Getters and setters
}
