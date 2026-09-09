import { CharacterClass, Difficulty, QuestStatus } from "./enums";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
    [Difficulty.EASY]: "Easy",
    [Difficulty.MEDIUM]: "Medium",
    [Difficulty.HARD]: "Hard",
    [Difficulty.EPIC]: "Epic",
};

export type DIFFICULTY_LABEL = typeof DIFFICULTY_LABEL[keyof typeof DIFFICULTY_LABEL]

export const DIFFICULTY_BADGE: Record<Difficulty, string> = {
    [Difficulty.EASY]: "badge--easy",
    [Difficulty.MEDIUM]: "badge--medium",
    [Difficulty.HARD]: "badge--hard",
    [Difficulty.EPIC]: "badge--epic",
};

export type DIFFICULTY_BADGE = typeof DIFFICULTY_BADGE[keyof typeof DIFFICULTY_BADGE]

export const STATUS_LABEL: Record<QuestStatus, string> = {
    [QuestStatus.AVAILABLE]: "Available",
    [QuestStatus.ON_GOING]: "On going",
    [QuestStatus.COMPLETED]: "Completed",
};

export type STATUS_LABEL = typeof STATUS_LABEL[keyof typeof STATUS_LABEL]

export const CLASS_LABEL: Record<CharacterClass, string> = {
    [CharacterClass.WARRIOR]: "Warrior",
    [CharacterClass.RANGER]: "Ranger",
    [CharacterClass.MAGE]: "Mage",
    [CharacterClass.CLERIC]: "Cleric",
};
