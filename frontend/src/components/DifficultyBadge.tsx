import type { Difficulty } from "./enums";
import { DIFFICULTY_BADGE, DIFFICULTY_LABEL } from "./Record";

interface DifficultyBadgeProps {
    difficulty: Difficulty;
    large?: boolean;
}

export default function DifficultyBadge({ difficulty, large = false }: DifficultyBadgeProps) {
    return (
        <span className={`badge${large ? " badge--lg" : ""} ${DIFFICULTY_BADGE[difficulty]}`}>
            {DIFFICULTY_LABEL[difficulty]}
        </span>
    );
}
