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

export const DIFFICULTY_ORDER: Record<Difficulty, number> = {
    [Difficulty.EASY]: 0,
    [Difficulty.MEDIUM]: 1,
    [Difficulty.HARD]: 2,
    [Difficulty.EPIC]: 3,
};

export const STATUS_ORDER: Record<QuestStatus, number> = {
    [QuestStatus.AVAILABLE]: 0,
    [QuestStatus.ON_GOING]: 1,
    [QuestStatus.COMPLETED]: 2,
};

export const DIFFICULTY_REWARD_RATIO: Record<Difficulty, number> = {
    [Difficulty.EASY]: 0.2,
    [Difficulty.MEDIUM]: 0.5,
    [Difficulty.HARD]: 0.9,
    [Difficulty.EPIC]: 1.5,
};

export const CLASS_COLOR: Record<CharacterClass, string> = {
    [CharacterClass.WARRIOR]: "class--warrior",
    [CharacterClass.RANGER]: "class--ranger",
    [CharacterClass.MAGE]: "class--mage",
    [CharacterClass.CLERIC]: "class--cleric",
};
