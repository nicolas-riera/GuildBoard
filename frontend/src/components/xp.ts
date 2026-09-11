import type { AdventurerResponse } from "../types/adventurer";

export function xpToNextLevel(level: number): number {
    return level * 100;
}

export function xpPercent(adventurer: AdventurerResponse): number {
    const needed = xpToNextLevel(adventurer.level);
    if (needed <= 0) return 0;
    return Math.min(100, Math.round((adventurer.xp / needed) * 100));
}
