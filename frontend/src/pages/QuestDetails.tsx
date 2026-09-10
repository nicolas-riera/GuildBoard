import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { deleteQuest, getQuestById } from "../services/QuestServices";
import type { QuestResponse } from "../types/quest";
import { DIFFICULTY_LABEL, DIFFICULTY_BADGE, STATUS_LABEL } from "../components/Record";
import { QuestStatus } from "../components/enums";
import AdventurersModal from "../components/AdventurersModal";
import CompleteQuestModal from "../components/CompleteQuestModal";
import ConfirmModal from "../components/ConfirmModal";
import { ROUTES, questEditPath } from "../routes";

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

    // an available quest gets handed out, an on going one gets closed
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
                        <span className={`badge badge--lg ${DIFFICULTY_BADGE[quest.difficulty]}`}>
                            {DIFFICULTY_LABEL[quest.difficulty]}
                        </span>
                    </div>

                    <div className="quest-detail__reward">
                        <span className="quest-detail__reward-title">Reward</span>
                        <span className="reward reward--lg">
                            <span className="reward__gold">{quest.goldReward} gold</span>
                            <span className="reward__sep">&amp;</span>
                            <span className="reward__xp">{quest.xpReward} xp</span>
                        </span>
                    </div>

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
                        {quest.status !== QuestStatus.ON_GOING && (
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