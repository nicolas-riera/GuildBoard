package com.forgesoft.guildboard.entity;

import com.forgesoft.guildboard.enums.CharacterClass;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name="\"Adventurer\"")
public class Adventurer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 50)
    @Column(name = "name", nullable = false, unique = true, length = 50)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "\"characterClass\"", nullable = false)
    private CharacterClass characterClass;

    @Min(1)
    @Column(name = "level", nullable = false)
    private int level = 1;

    @Min(0)
    @Column(name = "xp", nullable = false)
    private int xp = 0;

    @Min(0)
    @Column(name = "gold", nullable = false)
    private int gold = 0;
    
    // Getters and setters
}
