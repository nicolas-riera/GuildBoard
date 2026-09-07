package com.forgesoft.guildboard.dto;

import jakarta.validation.constraints.NotNull;

public record QuestRequest(@NotNull Long adventurerId) {}