import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
    deleteAdventurer,
    getAdventurerById,
    getAdventurerHistory,
} from "../services/adventurerServices";
import type { AdventurerResponse } from "../types/adventurer";
import type { AssignmentResponse } from "../types/assignment";
import { CLASS_COLOR, CLASS_LABEL, DIFFICULTY_BADGE, DIFFICULTY_LABEL } from "../components/Record";
import CompleteQuestModal from "../components/CompleteQuestModal";
import ConfirmModal from "../components/ConfirmModal";
import XpBar from "../components/XpBar";
import { xpToNextLevel } from "../components/xp";
import { formatDateTime } from "../components/format";
import { ROUTES, adventurerEditPath, questDetailsPath } from "../routes";

interface LoadResult {
    adventurerId: number;
    adventurer: AdventurerResponse | null;
    history: AssignmentResponse[];
    error: string | null;
}

function byMostRecent(a: AssignmentResponse, b: AssignmentResponse): number {
    const left = new Date(a.completedAt ?? a.assignedAt).getTime();
    const right = new Date(b.completedAt ?? b.assignedAt).getTime();
    return right - left;
}

export default function AdventurerDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const adventurerId = Number(id);

    const [result, setResult] = useState<LoadResult | null>(null);
    const [completeOpen, setCompleteOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const closeComplete = useCallback(() => setCompleteOpen(false), []);
    const closeDelete = useCallback(() => setDeleteOpen(false), []);

    const handleCompleted = useCallback(() => {
        setCompleteOpen(false);
        setReloadToken((token) => token + 1);
    }, []);

    useEffect(() => {
        if (Number.isNaN(adventurerId)) return;

        let cancelled = false;

        Promise.all([getAdventurerById(adventurerId), getAdventurerHistory(adventurerId)])
            .then(([adventurer, history]) => {
                if (!cancelled) setResult({ adventurerId, adventurer, history, error: null });
            })
            .catch((err: Error) => {
                if (!cancelled) {
                    setResult({ adventurerId, adventurer: null, history: [], error: err.message });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [adventurerId, reloadToken]);

    const loaded = result?.adventurerId === adventurerId ? result : null;
    const loading = loaded === null;
    const adventurer = loaded?.adventurer ?? null;
    const error = loaded?.error ?? null;

    const onGoing = loaded?.history.find((assignment) => assignment.completedAt === null) ?? null;
    const completed = (loaded?.history ?? [])
        .filter((assignment) => assignment.completedAt !== null)
        .sort(byMostRecent);

    async function handleDelete() {
        if (adventurer === null) return;
        await deleteAdventurer(adventurer.id);
        navigate(ROUTES.adventurers);
    }

    return (
        <main className="adventurer-detail">
            {Number.isNaN(adventurerId) && <p className="empty-row">Invalid adventurer ID.</p>}

            {!Number.isNaN(adventurerId) && loading && (
                <p className="empty-row">Loading the adventurer...</p>
            )}

            {!Number.isNaN(adventurerId) && !loading && error && (
                <p className="empty-row">{error}</p>
            )}

            {!Number.isNaN(adventurerId) && !loading && !error && !adventurer && (
                <p className="empty-row">This adventurer does not exist.</p>
            )}

            {!Number.isNaN(adventurerId) && !loading && !error && adventurer && (
                <>
                    <div className="adventurer-detail__header">
                        <div className="adventurer-detail__identity">
                            <h2 className="adventurer-detail__title">{adventurer.name}</h2>
                            <span
                                className={`adventurer-detail__class ${CLASS_COLOR[adventurer.characterClass]}`}
                            >
                                {CLASS_LABEL[adventurer.characterClass]}
                            </span>
                        </div>
                        <span className="adventurer-detail__level">LVL {adventurer.level}</span>
                    </div>

                    <div className="adventurer-detail__stats">
                        <div className="adventurer-detail__stat">
                            <span className="adventurer-detail__stat-title">Purse</span>
                            <span className="reward reward--lg">
                                <span className="reward__gold">{adventurer.gold} gold</span>
                            </span>
                        </div>

                        <div className="adventurer-detail__stat">
                            <span className="adventurer-detail__stat-title">
                                Experience to level {adventurer.level + 1}
                            </span>
                            <XpBar adventurer={adventurer} />
                            <span className="adventurer-detail__stat-hint">
                                {adventurer.xp} / {xpToNextLevel(adventurer.level)} xp
                            </span>
                        </div>
                    </div>

                    <section className="adventurer-detail__section">
                        <h3 className="adventurer-detail__section-title">On going quest</h3>

                        {onGoing === null ? (
                            <p className="empty-row">This adventurer is not on a quest.</p>
                        ) : (
                            <div className="quest-line">
                                <div className="quest-line__main">
                                    <span className="quest-line__title">{onGoing.questTitle}</span>
                                    <span className="quest-line__date">
                                        Taken on {formatDateTime(onGoing.assignedAt)}
                                    </span>
                                </div>

                                <span className={`badge ${DIFFICULTY_BADGE[onGoing.questDifficulty]}`}>
                                    {DIFFICULTY_LABEL[onGoing.questDifficulty]}
                                </span>

                                <span className="reward">
                                    <span className="reward__gold">{onGoing.goldReward} gold</span>
                                    <span className="reward__sep">/</span>
                                    <span className="reward__xp">{onGoing.xpReward} xp</span>
                                </span>

                                <div className="quest-line__actions">
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={() => setCompleteOpen(true)}
                                    >
                                        Complete
                                    </button>
                                    <Link to={questDetailsPath(onGoing.questId)} className="btn">
                                        Details
                                    </Link>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="adventurer-detail__section">
                        <h3 className="adventurer-detail__section-title">
                            Completed quests ({completed.length})
                        </h3>

                        {completed.length === 0 ? (
                            <p className="empty-row">No quest has been completed yet.</p>
                        ) : (
                            <>
                                <div className="table-wrapper">
                                    <table className="table--history">
                                        <thead>
                                            <tr>
                                                <th>Quest</th>
                                                <th>Difficulty</th>
                                                <th>Reward</th>
                                                <th>Taken</th>
                                                <th>Completed</th>
                                                <th aria-hidden="true"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {completed.map((assignment) => (
                                                <tr key={assignment.id}>
                                                    <td>{assignment.questTitle}</td>
                                                    <td>
                                                        <span
                                                            className={`badge ${DIFFICULTY_BADGE[assignment.questDifficulty]}`}
                                                        >
                                                            {DIFFICULTY_LABEL[assignment.questDifficulty]}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="reward">
                                                            <span className="reward__gold">
                                                                {assignment.goldReward} gold
                                                            </span>
                                                            <span className="reward__sep">/</span>
                                                            <span className="reward__xp">
                                                                {assignment.xpReward} xp
                                                            </span>
                                                        </span>
                                                    </td>
                                                    <td className="history__date">
                                                        {formatDateTime(assignment.assignedAt)}
                                                    </td>
                                                    <td className="history__date">
                                                        {formatDateTime(assignment.completedAt ?? "")}
                                                    </td>
                                                    <td>
                                                        <Link
                                                            to={questDetailsPath(assignment.questId)}
                                                            className="btn"
                                                        >
                                                            Details
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="card-list">
                                    {completed.map((assignment) => (
                                        <div key={assignment.id} className="quest-card">
                                            <div className="quest-card__left">
                                                <span className="quest-card__title">
                                                    {assignment.questTitle}
                                                </span>
                                                <span className="quest-line__date">
                                                    Taken on {formatDateTime(assignment.assignedAt)}
                                                </span>
                                                <span className="quest-line__date">
                                                    Completed on {formatDateTime(assignment.completedAt ?? "")}
                                                </span>
                                                <span className="reward">
                                                    <span className="reward__gold">
                                                        {assignment.goldReward} gold
                                                    </span>
                                                    <span className="reward__sep">/</span>
                                                    <span className="reward__xp">
                                                        {assignment.xpReward} xp
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="quest-card__right">
                                                <span
                                                    className={`badge ${DIFFICULTY_BADGE[assignment.questDifficulty]}`}
                                                >
                                                    {DIFFICULTY_LABEL[assignment.questDifficulty]}
                                                </span>
                                                <Link
                                                    to={questDetailsPath(assignment.questId)}
                                                    className="btn btn--sm"
                                                >
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </section>

                    <div className="quest-detail__footer">
                        <Link to={ROUTES.adventurers} className="btn">
                            Back to the guild
                        </Link>
                        <button
                            type="button"
                            className="btn"
                            onClick={() => navigate(adventurerEditPath(adventurer.id))}
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            className="btn btn--icon btn--danger"
                            onClick={() => setDeleteOpen(true)}
                            disabled={onGoing !== null}
                            title={
                                onGoing === null
                                    ? "Delete this adventurer"
                                    : "An adventurer on a quest cannot be deleted"
                            }
                            aria-label={`Delete the adventurer ${adventurer.name}`}
                        >
                            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                                <circle cx="12" cy="12" r="10" fill="currentColor" />
                                <path
                                    d="M8.5 8.5l7 7M15.5 8.5l-7 7"
                                    stroke="var(--btn-bg)"
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {completeOpen && onGoing !== null && (
                        <CompleteQuestModal
                            questId={onGoing.questId}
                            onCompleted={handleCompleted}
                            onClose={closeComplete}
                        />
                    )}

                    {deleteOpen && (
                        <ConfirmModal
                            title="Delete the adventurer"
                            message={
                                <>
                                    <strong>{adventurer.name}</strong> and their quest history
                                    will be removed for good.
                                </>
                            }
                            question="Do you really want to delete them?"
                            pendingLabel="Deleting..."
                            onConfirm={handleDelete}
                            onClose={closeDelete}
                        />
                    )}
                </>
            )}
        </main>
    );
}
