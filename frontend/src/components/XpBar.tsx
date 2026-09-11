import type { AdventurerResponse } from "../types/adventurer";
import { xpPercent, xpToNextLevel } from "./xp";

import "../styles/xp-bar.css";

interface XpBarProps {
    adventurer: AdventurerResponse;
}

export default function XpBar({ adventurer }: XpBarProps) {
    const needed = xpToNextLevel(adventurer.level);

    return (
        <div className="xp" title={`${adventurer.xp} / ${needed} xp`}>
            <div
                className="xp__track"
                role="progressbar"
                aria-label="Progress to the next level"
                aria-valuemin={0}
                aria-valuemax={needed}
                aria-valuenow={adventurer.xp}
            >
                <div className="xp__fill" style={{ width: `${xpPercent(adventurer)}%` }} />
            </div>
            <span className="xp__label">
                {adventurer.xp}/{needed}
            </span>
        </div>
    );
}
