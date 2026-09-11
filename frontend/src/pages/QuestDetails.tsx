import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import AdventurersModal from "../components/AdventurersModal";
import CompleteQuestModal from "../components/CompleteQuestModal";
import ConfirmModal from "../components/ConfirmModal";
import DeleteIcon from "../components/DeleteIcon";
import DifficultyBadge from "../components/DifficultyBadge";
import { QuestStatus } from "../components/enums";
import { formatDateTime, formatDuration } from "../components/format";
import { STATUS_LABEL } from "../components/Record";
import Reward from "../components/Reward";
import { ROUTES, adventurerDetailsPath, questEditPath } from "../routes";
import { findQuestAssignment, type QuestAssignment } from "../services/adventurerServices";
import { deleteQuest, getQuestById } from "../services/QuestServices";
import type { QuestResponse } from "../types/quest";

import "../styles/pages/quest-details.css";

interface LoadResult {
    questId: number;
    quest: QuestResponse | null;
    error: string | null;
}

export default function QuestDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const questId = Number(id);

    const [result, setResult] = useState<LoadResult | null>(null);
    const [assignment, setAssignment] = useState<QuestAssignment | null>(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [adventurersOpen, setAdventurersOpen] = useState(false);
    const [completeOpen, setCompleteOpen] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const closeAdventurers = useCallback(() => setAdventurersOpen(false), []);
    const closeComplete = useCallback(() => setCompleteOpen(false), []);
    const closeDelete = useCallback(() => setDeleteOpen(false), []);

    const handleAssigned = useCallback(() => {
        setAdventurersOpen(false);
        setReloadToken((token) => token + 1);
    }, []);

    const handleCompleted = useCallback(() => {
        setCompleteOpen(false);
        setReloadToken((token) => token + 1);
    }, []);

    useEffect(() => {
        if (Number.isNaN(questId)) return;

        let cancelled = false;

        getQuestById(questId)
            .then((quest) => {
                if (!cancelled) setResult({ questId, quest, error: null });
            })
            .catch((err: Error) => {
                if (!cancelled) setResult({ questId, quest: null, error: err.message });
            });

        return () => {
            cancelled = true;
        };
    }, [questId, reloadToken]);

    const loaded = result?.questId === questId ? result : null;
    const loading = loaded === null;
    const quest = loaded?.quest ?? null;
    const error = loaded?.error ?? null;

    useEffect(() => {
        if (quest === null || quest.status === QuestStatus.AVAILABLE) return;

        let cancelled = false;

        findQuestAssignment(quest.id)
            .then((found) => {
                if (!cancelled && found !== null) setAssignment(found);
            })
            .catch(() => undefined);

        return () => {
            cancelled = true;
        };
    }, [quest]);

    const questAssignment =
        quest !== null
        && quest.status !== QuestStatus.AVAILABLE
        && assignment?.assignment.questId === quest.id
            ? assignment
            : null;

    const statusAction =
        quest?.status === QuestStatus.AVAILABLE
            ? () => setAdventurersOpen(true)
            : quest?.status === QuestStatus.ON_GOING
              ? () => setCompleteOpen(true)
              : null;

    async function handleDelete() {
        if (!quest) return;
        await deleteQuest(quest.id);
        navigate(ROUTES.dashboard);
    }

    return (
        <main className="quest-detail">
            {Number.isNaN(questId) && <p className="empty-row">Invalid quest ID.</p>}

            {!Number.isNaN(questId) && loading && (
                <p className="empty-row">Loading the quest...</p>
            )}

            {!Number.isNaN(questId) && !loading && error && (
                <p className="empty-row">{error}</p>
            )}

            {!Number.isNaN(questId) && !loading && !error && !quest && (
                <p className="empty-row">This quest does not exist.</p>
            )}

            {!Number.isNaN(questId) && !loading && !error && quest && (
                <>
                    <div className="quest-detail__header">
                        <h2 className="quest-detail__title">{quest.title}</h2>
                        <span className="quest-detail__level">
                            LVL Required : {quest.requiredLevel}
                        </span>
                    </div>

                    <p className="quest-detail__description">{quest.description}</p>

                    <div className="quest-detail__row">
                        <DifficultyBadge difficulty={quest.difficulty} large />
                    </div>

                    <div className="quest-detail__reward">
                        <span className="quest-detail__reward-title">Reward</span>
                        <Reward
                            gold={quest.goldReward}
                            xp={quest.xpReward}
                            large
                            separator="&"
                        />
                    </div>

                    {questAssignment !== null && (
                        <div className="quest-detail__assignment">
                            <span className="quest-detail__assignment-line">
                                {questAssignment.assignment.completedAt === null ? "Taken by " : "Completed by "}
                                <Link
                                    to={adventurerDetailsPath(questAssignment.adventurer.id)}
                                    className="quest-detail__adventurer"
                                >
                                    {questAssignment.adventurer.name}
                                </Link>
                            </span>

                            {questAssignment.assignment.completedAt === null ? (
                                <span className="quest-detail__assignment-meta">
                                    On this quest for{" "}
                                    {formatDuration(questAssignment.assignment.assignedAt, null)}, since{" "}
                                    {formatDateTime(questAssignment.assignment.assignedAt)}
                                </span>
                            ) : (
                                <span className="quest-detail__assignment-meta">
                                    Finished on {formatDateTime(questAssignment.assignment.completedAt)},
                                    {" "}
                                    {formatDuration(
                                        questAssignment.assignment.assignedAt,
                                        questAssignment.assignment.completedAt
                                    )}{" "}
                                    after being taken on{" "}
                                    {formatDateTime(questAssignment.assignment.assignedAt)}
                                </span>
                            )}
                        </div>
                    )}

                    <div className="quest-detail__row">
                        {statusAction !== null ? (
                            <button
                                type="button"
                                className="quest-detail__status quest-detail__status--action"
                                onClick={statusAction}
                            >
                                {STATUS_LABEL[quest.status]}
                            </button>
                        ) : (
                            <span className="quest-detail__status">{STATUS_LABEL[quest.status]}</span>
                        )}
                    </div>

                    <div className="quest-detail__footer">
                        <Link to={ROUTES.dashboard} className="btn">
                            Back to the board
                        </Link>
                        {quest.status === QuestStatus.AVAILABLE && (
                            <button
                                type="button"
                                className="btn"
                                onClick={() => navigate(questEditPath(quest.id))}
                            >
                                Edit
                            </button>
                        )}
                        {quest.status === QuestStatus.AVAILABLE && (
                            <button
                                type="button"
                                className="btn btn--icon btn--danger"
                                onClick={() => setDeleteOpen(true)}
                                title="Delete this quest"
                                aria-label={`Delete the quest ${quest.title}`}
                            >
                                <DeleteIcon />
                            </button>
                        )}
                    </div>

                    {adventurersOpen && (
                        <AdventurersModal
                            questId={quest.id}
                            requiredLevel={quest.requiredLevel}
                            onAssigned={handleAssigned}
                            onClose={closeAdventurers}
                        />
                    )}

                    {completeOpen && (
                        <CompleteQuestModal
                            questId={quest.id}
                            assignment={questAssignment ?? undefined}
                            onCompleted={handleCompleted}
                            onClose={closeComplete}
                        />
                    )}

                    {deleteOpen && (
                        <ConfirmModal
                            title="Delete the quest"
                            message={<>The quest <strong>{quest.title}</strong> will be removed for good.</>}
                            question="Do you really want to delete it?"
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