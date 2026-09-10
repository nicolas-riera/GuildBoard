import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getAdventurers, getOnGoingQuests } from "../services/adventurerServices";
import { CharacterClass } from "../components/enums";
import type { AdventurerResponse } from "../types/adventurer";
import { CLASS_COLOR, CLASS_LABEL } from "../components/Record";
import RangeFilter from "../components/RangeFilter";
import type { RangeMode } from "../components/RangeFilter";
import SortableHeader from "../components/SortableHeader";
import type { Sort } from "../components/SortableHeader";
import XpBar from "../components/XpBar";
import { adventurerDetailsPath } from "../routes";

type ClassFilter = CharacterClass | "ALL";
type SortKey = "name" | "class" | "level" | "gold" | "xp";

const SORT_COMPARE: Record<SortKey, (a: AdventurerResponse, b: AdventurerResponse) => number> = {
    name: (a, b) => a.name.localeCompare(b.name),
    class: (a, b) => CLASS_LABEL[a.characterClass].localeCompare(CLASS_LABEL[b.characterClass]),
    level: (a, b) => a.level - b.level,
    gold: (a, b) => a.gold - b.gold,
    xp: (a, b) => a.xp - b.xp,
};

function rankByPodium(adventurers: AdventurerResponse[]): Map<number, number> {
    const podium = [...adventurers]
        .sort((a, b) => (b.level - a.level) || (b.xp - a.xp))
        .slice(0, 3);

    return new Map(podium.map((adventurer, index) => [adventurer.id, index + 1]));
}

export default function Adventurers() {
    const [adventurers, setAdventurers] = useState<AdventurerResponse[]>([]);
    const [onGoingQuests, setOnGoingQuests] = useState<Map<number, string>>(new Map());
    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState<ClassFilter>("ALL");
    const [levelMode, setLevelMode] = useState<RangeMode>("MIN");
    const [level, setLevel] = useState(1);
    const [goldMode, setGoldMode] = useState<RangeMode>("MIN");
    const [gold, setGold] = useState(0);
    const [onQuestOnly, setOnQuestOnly] = useState(false);
    const [sort, setSort] = useState<Sort<SortKey> | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        getAdventurers()
            .then(async (data) => {
                if (cancelled) return;
                setAdventurers(data);
                setLoadError(null);

                const onGoing = await getOnGoingQuests(data);
                if (!cancelled) setOnGoingQuests(onGoing);
            })
            .catch((err: Error) => {
                if (!cancelled) setLoadError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const podium = useMemo(() => rankByPodium(adventurers), [adventurers]);

    const visibleAdventurers = useMemo(() => {
        const needle = search.trim().toLowerCase();

        const filtered = adventurers.filter((adventurer) => {
            if (classFilter !== "ALL" && adventurer.characterClass !== classFilter) return false;
            if (levelMode === "MIN" && adventurer.level < level) return false;
            if (levelMode === "MAX" && adventurer.level > level) return false;
            if (goldMode === "MIN" && adventurer.gold < gold) return false;
            if (goldMode === "MAX" && adventurer.gold > gold) return false;
            if (onQuestOnly && !onGoingQuests.has(adventurer.id)) return false;
            if (needle !== "" && !adventurer.name.toLowerCase().includes(needle)) return false;
            return true;
        });

        if (sort === null) return filtered;

        const compare = SORT_COMPARE[sort.key];
        const way = sort.direction === "asc" ? 1 : -1;
        return [...filtered].sort((a, b) => compare(a, b) * way);
    }, [adventurers, classFilter, levelMode, level, goldMode, gold, onQuestOnly, onGoingQuests, search, sort]);

    const totalGold = visibleAdventurers.reduce((sum, adventurer) => sum + adventurer.gold, 0);

    function toggleSort(key: SortKey) {
        setSort((current) =>
            current !== null && current.key === key
                ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
                : { key, direction: "asc" }
        );
    }

    function renderName(adventurer: AdventurerResponse) {
        const rank = podium.get(adventurer.id);
        const quest = onGoingQuests.get(adventurer.id);

        return (
            <div className="guild-name">
                <span className="guild-name__row">
                    {rank !== undefined && (
                        <span className={`rank rank--${rank}`} title={`Rank ${rank} of the guild`}>
                            {rank}
                        </span>
                    )}
                    <span className="guild-name__label">{adventurer.name}</span>
                </span>
                {quest !== undefined && <span className="guild-name__quest">On going : {quest}</span>}
            </div>
        );
    }

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="filter">
                    <label htmlFor="adventurer-search">Search</label>
                    <input
                        id="adventurer-search"
                        type="search"
                        placeholder="Adventurer name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="filter">
                    <label htmlFor="class-filter">Class</label>
                    <select
                        id="class-filter"
                        value={classFilter}
                        onChange={(e) => setClassFilter(e.target.value as ClassFilter)}
                    >
                        <option value="ALL">All</option>
                        {Object.values(CharacterClass).map((value) => (
                            <option key={value} value={value}>
                                {CLASS_LABEL[value]}
                            </option>
                        ))}
                    </select>
                </div>

                <RangeFilter
                    id="level"
                    label="Level"
                    mode={levelMode}
                    value={level}
                    floor={1}
                    onModeChange={setLevelMode}
                    onValueChange={setLevel}
                />

                <RangeFilter
                    id="gold"
                    label="Gold"
                    mode={goldMode}
                    value={gold}
                    floor={0}
                    onModeChange={setGoldMode}
                    onValueChange={setGold}
                />

                <div className="filter">
                    <label htmlFor="quest-filter">Quest</label>
                    <button
                        id="quest-filter"
                        type="button"
                        className={`btn filter__toggle${onQuestOnly ? " filter__toggle--on" : ""}`}
                        aria-pressed={onQuestOnly}
                        onClick={() => setOnQuestOnly((current) => !current)}
                    >
                        On a quest
                    </button>
                </div>
            </aside>

            <main className="content">
                <div className="guild-header">
                    <h2 className="content__title">My guild</h2>
                    <div className="guild-stats">
                        <span>Number of adventurers : {visibleAdventurers.length}</span>
                        <span>
                            Total gold : <span className="reward__gold">{totalGold} gold</span>
                        </span>
                    </div>
                </div>

                <div className="table-wrapper">
                    <table className="table--guild">
                        <thead>
                            <tr>
                                <SortableHeader label="Name" sortKey="name" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="Class" sortKey="class" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="LVL" sortKey="level" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="Gold" sortKey="gold" sort={sort} onSort={toggleSort} />
                                <SortableHeader label="Xp" sortKey="xp" sort={sort} onSort={toggleSort} />
                                <th aria-hidden="true"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleAdventurers.map((adventurer) => (
                                <tr key={adventurer.id}>
                                    <td>{renderName(adventurer)}</td>
                                    <td>
                                        <span className={CLASS_COLOR[adventurer.characterClass]}>
                                            {CLASS_LABEL[adventurer.characterClass]}
                                        </span>
                                    </td>
                                    <td>{adventurer.level}</td>
                                    <td>
                                        <span className="reward__gold">{adventurer.gold}</span>
                                    </td>
                                    <td>
                                        <XpBar adventurer={adventurer} />
                                    </td>
                                    <td>
                                        <Link to={adventurerDetailsPath(adventurer.id)} className="btn">
                                            Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {visibleAdventurers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="empty-row">
                                        {loadError ?? "No adventurer matches these filters."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="card-list">
                    {visibleAdventurers.map((adventurer) => (
                        <div key={adventurer.id} className="guild-card">
                            <div className="guild-card__top">
                                {renderName(adventurer)}
                                <span className={`guild-card__class ${CLASS_COLOR[adventurer.characterClass]}`}>
                                    {CLASS_LABEL[adventurer.characterClass]}
                                </span>
                            </div>
                            <div className="guild-card__bottom">
                                <span className="guild-card__meta">LVL {adventurer.level}</span>
                                <span className="reward__gold">{adventurer.gold} gold</span>
                                <Link to={adventurerDetailsPath(adventurer.id)} className="btn btn--sm">
                                    Details
                                </Link>
                            </div>
                            <XpBar adventurer={adventurer} />
                        </div>
                    ))}
                    {visibleAdventurers.length === 0 && (
                        <div className="empty-row">
                            {loadError ?? "No adventurer matches these filters."}
                        </div>
                    )}
                </div>

                <div className="action-bar">
                    <button type="button" className="btn btn--action">
                        Add an adventurer
                    </button>
                </div>
            </main>
        </div>
    );
}
