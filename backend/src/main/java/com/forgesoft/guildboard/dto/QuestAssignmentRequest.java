package com.forgesoft.guildboard.dto;

import jakarta.validation.constraints.NotNull;

public record QuestAssignmentRequest(@NotNull Long adventurerId) {} // Have the adventurer ID in the body in the Put request when assigning a Quest