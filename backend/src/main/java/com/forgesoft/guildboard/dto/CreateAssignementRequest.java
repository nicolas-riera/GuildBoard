package com.forgesoft.guildboard.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateAssignementRequest(
        @NotBlank String adventurer,
        @NotBlank String quest,
        @NotNull LocalDateTime assignedAt
) {}