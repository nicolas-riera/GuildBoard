import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getQuests } from "../services/QuestServices";
import { Difficulty, QuestStatus } from "../components/enums";
import type { QuestResponse } from "../types/quest";
import { DIFFICULTY_LABEL, DIFFICULTY_BADGE, STATUS_LABEL } from "../components/Record";
import { questDetailsPath } from "../routes";

type StatusFilter = QuestStatus | "ALL";
type DifficultyFilter = Difficulty | "ALL";

export default function Dashboard() {
    const [quests, setQuests] = useState<QuestResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("ALL");
    const [minLevel, setMinLevel] = useState(1);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        getQuests()
            .then((data) => {
                setQuests(data);
                setLoadError(null);
            })
            .catch((err: Error) => setLoadError(err.message));
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
                                        <Link to={questDetailsPath(quest.id)} className="btn">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {filteredQuests.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="empty-row">
                                        {loadError ?? "No quests match these filters."}
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
                                <Link to={questDetailsPath(quest.id)} className="btn btn--sm">
                                    Details
                                </Link>
                            </div>
                        </div>
                    ))}
                    {filteredQuests.length === 0 && (
                        <div className="empty-row">{loadError ?? "No quests match these filters."}</div>
                    )}
                </div>

                <div className="action-bar">
                    <button type="button" className="btn btn--action">
                        Add an Quest
                    </button>
                </div>
            </main>
        </div>
    );
}