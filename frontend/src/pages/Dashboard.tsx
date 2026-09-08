import { getQuests } from "../services/QuestServices";
import { useEffect, useMemo, useState } from "react";
import { Difficulty, QuestStatus } from "../enums";
import type { QuestResponse } from "../types/quest";

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
    [Difficulty.EASY]: "Easy",
    [Difficulty.MEDIUM]: "Medium",
    [Difficulty.HARD]: "Hard",
    [Difficulty.EPIC]: "Epic",
};

const DIFFICULTY_BADGE: Record<Difficulty, string> = {
    [Difficulty.EASY]: "badge--easy",
    [Difficulty.MEDIUM]: "badge--medium",
    [Difficulty.HARD]: "badge--hard",
    [Difficulty.EPIC]: "badge--epic",
};

const STATUS_LABEL: Record<QuestStatus, string> = {
    [QuestStatus.AVAILABLE]: "Available",
    [QuestStatus.ON_GOING]: "On going",
    [QuestStatus.COMPLETED]: "Completed",
};

type StatusFilter = QuestStatus | "ALL";
type DifficultyFilter = Difficulty | "ALL";

export default function Dashboard() {
    const [quests, setQuests] = useState<QuestResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("ALL");
    const [minLevel, setMinLevel] = useState(1);

    useEffect(() => {
        getQuests()
            .then(setQuests)
            .catch((err) => console.error(err));
    }, []);

    const filteredQuests = useMemo(() => {
        return quests.filter((quest) => {
            if (statusFilter !== "ALL" && quest.status !== statusFilter) return false;
            if (difficultyFilter !== "ALL" && quest.difficulty !== difficultyFilter) return false;
            if (quest.requiredLevel < minLevel) return false;
            return true;
        });
    }, [quests, statusFilter, difficultyFilter, minLevel]);

    return (
        <div className="page">
            <header className="topbar">
                <h1 className="topbar__title">GuildBoard</h1>
                <nav className="topbar__nav">
                    <button type="button" className="topbar__link">
                        Adventurers
                    </button>
                </nav>
            </header>

            <div className="layout">
                <aside className="sidebar">
                    <div className="filter">
                        <label htmlFor="status-filter">Status</label>
                        <select
                            id="status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                        >
                            <option value="ALL">All</option>
                            <option value={QuestStatus.AVAILABLE}>Available</option>
                            <option value={QuestStatus.ON_GOING}>On going</option>
                            <option value={QuestStatus.COMPLETED}>Completed</option>
                        </select>
                    </div>

                    <div className="filter">
                        <label htmlFor="difficulty-filter">Difficulty</label>
                        <select
                            id="difficulty-filter"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                        >
                            <option value="ALL">All</option>
                            <option value={Difficulty.EASY}>Easy</option>
                            <option value={Difficulty.MEDIUM}>Medium</option>
                            <option value={Difficulty.HARD}>Hard</option>
                            <option value={Difficulty.EPIC}>Epic</option>
                        </select>
                    </div>

                    <div className="filter">
                        <label htmlFor="level-filter">Required level</label>
                        <input
                            id="level-filter"
                            type="number"
                            min={1}
                            value={minLevel}
                            onChange={(e) => setMinLevel(Math.max(1, Number(e.target.value) || 1))}
                        />
                    </div>
                </aside>

                <main className="content">
                    <h2 className="content__title">Available quests</h2>

                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Difficulty</th>
                                    <th>Reward</th>
                                    <th>LVL</th>
                                    <th>Status</th>
                                    <th aria-hidden="true"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredQuests.map((quest) => (
                                    <tr key={quest.id}>
                                        <td>{quest.title}</td>
                                        <td>
                                            <span className={`badge ${DIFFICULTY_BADGE[quest.difficulty]}`}>
                                                {DIFFICULTY_LABEL[quest.difficulty]}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="reward">
                                                <span className="reward__gold">{quest.goldReward} gold</span>
                                                <span className="reward__sep">/</span>
                                                <span className="reward__xp">{quest.xpReward} xp</span>
                                            </span>
                                        </td>
                                        <td>{quest.requiredLevel}</td>
                                        <td className="status-text">{STATUS_LABEL[quest.status]}</td>
                                        <td>
                                            <button type="button" className="btn">
                                                Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredQuests.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="empty-row">
                                            No quests match these filters.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="card-list">
                        {filteredQuests.map((quest) => (
                            <div key={quest.id} className="quest-card">
                                <div className="quest-card__left">
                                    <span className="quest-card__title">{quest.title}</span>
                                    <span className="quest-card__meta">lvl required : {quest.requiredLevel}</span>
                                    <span className="reward">
                                        <span className="reward__gold">{quest.goldReward} gold</span>
                                        <span className="reward__sep">/</span>
                                        <span className="reward__xp">{quest.xpReward} xp</span>
                                    </span>
                                </div>
                                <div className="quest-card__right">
                                    <span className={`badge ${DIFFICULTY_BADGE[quest.difficulty]}`}>
                                        {DIFFICULTY_LABEL[quest.difficulty]}
                                    </span>
                                    <span className="quest-card__status">{STATUS_LABEL[quest.status]}</span>
                                    <button type="button" className="btn btn--sm">
                                        Details
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredQuests.length === 0 && (
                            <div className="empty-row">No quests match these filters.</div>
                        )}
                    </div>

                    <div className="action-bar">
                        <button type="button" className="btn btn--action">
                            Add an Quest
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}