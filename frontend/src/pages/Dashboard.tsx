import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getQuests } from "../services/QuestServices";
import { Difficulty, QuestStatus } from "../components/enums";
import type { QuestResponse } from "../types/quest";
import {
    DIFFICULTY_LABEL,
    DIFFICULTY_BADGE,
    DIFFICULTY_ORDER,
    STATUS_LABEL,
    STATUS_ORDER,
} from "../components/Record";
import RangeFilter from "../components/RangeFilter";
import type { RangeMode } from "../components/RangeFilter";
import SortableHeader from "../components/SortableHeader";
import type { Sort } from "../components/SortableHeader";
import { ROUTES, questDetailsPath } from "../routes";

type StatusFilter = QuestStatus | "ALL";
type DifficultyFilter = Difficulty | "ALL";
type SortKey = "title" | "difficulty" | "gold" | "level" | "status";

const SORT_COMPARE: Record<SortKey, (a: QuestResponse, b: QuestResponse) => number> = {
    title: (a, b) => a.title.localeCompare(b.title),
    difficulty: (a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty],
    gold: (a, b) => a.goldReward - b.goldReward,
    level: (a, b) => a.requiredLevel - b.requiredLevel,
    status: (a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status],
};

export default function Dashboard() {
    const [quests, setQuests] = useState<QuestResponse[]>([]);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("ALL");
    const [levelMode, setLevelMode] = useState<RangeMode>("MIN");
    const [level, setLevel] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<Sort<SortKey> | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        getQuests()
            .then((data) => {
                setQuests(data);
                setLoadError(null);
            })
            .catch((err: Error) => setLoadError(err.message));
    }, []);

    const visibleQuests = useMemo(() => {
        const needle = search.trim().toLowerCase();

        const filtered = quests.filter((quest) => {
            if (quest.status === QuestStatus.COMPLETED) return false;
            if (statusFilter !== "ALL" && quest.status !== statusFilter) return false;
            if (difficultyFilter !== "ALL" && quest.difficulty !== difficultyFilter) return false;
            if (levelMode === "MIN" && quest.requiredLevel < level) return false;
            if (levelMode === "MAX" && quest.requiredLevel > level) return false;
            if (needle !== "" && !quest.title.toLowerCase().includes(needle)) return false;
            return true;
        });

        if (sort === null) return filtered;

        const compare = SORT_COMPARE[sort.key];
        const way = sort.direction === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => compare(a, b) * way);
    }, [quests, statusFilter, difficultyFilter, levelMode, level, search, sort]);

    function toggleSort(key: SortKey) {
        setSort((current) =>
            current !== null && current.key === key
                ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
                : { key, direction: "asc" }
        );
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="filter">
                    <label htmlFor="quest-search">Search</label>
                    <input
                        id="quest-search"
                        type="search"
                        placeholder="Quest title"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

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

                <RangeFilter
                    id="level"
                    label="Required level"
                    mode={levelMode}
                    value={level}
                    floor={1}
                    onModeChange={setLevelMode}
                    onValueChange={setLevel}
                />
            </aside>

            <main className="content">
                <h2 className="content__title">Available quests</h2>

                <div className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <SortableHeader label="Title" sortKey="title" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="Difficulty" sortKey="difficulty" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="Reward" sortKey="gold" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="LVL" sortKey="level" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="Status" sortKey="status" sort={sort} onSort={toggleSort} />
                                <th aria-hidden="true"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleQuests.map((quest) => (
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
                            {visibleQuests.length === 0 && (
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
                    {visibleQuests.map((quest) => (
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
                    {visibleQuests.length === 0 && (
                        <div className="empty-row">{loadError ?? "No quests match these filters."}</div>
                    )}
                </div>

                <div className="action-bar">
                    <Link to={ROUTES.newQuest} className="btn btn--action">
                        Add an Quest
                    </Link>
                </div>
            </main>
        </div>
    );
}
