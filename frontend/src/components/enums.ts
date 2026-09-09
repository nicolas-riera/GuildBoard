export const CharacterClass = {
    WARRIOR : "WARRIOR",
    RANGER : "RANGER",
    MAGE : "MAGE",
    CLERIC : "CLERIC"
    } as const;

export type CharacterClass = (typeof CharacterClass)[keyof typeof CharacterClass];

export const Difficulty = {
    EASY : "EASY",
    MEDIUM : "MEDIUM",
    HARD : "HARD",
    EPIC : "EPIC"
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const QuestStatus = {
    AVAILABLE : "AVAILABLE",
    ON_GOING : "ON_GOING",
    COMPLETED : "COMPLETED"
    } as const;

export type QuestStatus = (typeof QuestStatus)[keyof typeof QuestStatus];
