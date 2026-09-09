import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { deleteQuest, getQuestById } from "../services/QuestServices";
import type { QuestResponse } from "../types/quest";
import { DIFFICULTY_LABEL, DIFFICULTY_BADGE, STATUS_LABEL } from "../components/Record";
import { QuestStatus } from "../components/enums";
import AdventurersModal from "../components/AdventurersModal";
import { ROUTES } from "../routes";

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
    const [actionError, setActionError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [adventurersOpen, setAdventurersOpen] = useState(false);
    const [reloadToken, setReloadToken] = useState(0);

    const closeAdventurers = useCallback(() => setAdventurersOpen(false), []);

    const handleAssigned = useCallback(() => {
        setAdventurersOpen(false);
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
    const error = loaded?.error ?? actionError;

    async function handleDelete() {
        if (!quest || deleting) return;
        if (!window.confirm(`Delete the quest "${quest.title}" ?`)) return;

        setDeleting(true);
        setActionError(null);
        try {
            await deleteQuest(quest.id);
            navigate(ROUTES.dashboard);
        } catch (err) {
            setActionError((err as Error).message);
        } finally {
            setDeleting(false);
        }
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
                        {quest.status === QuestStatus.AVAILABLE ? (
                            <button
                                type="button"
                                className="quest-detail__status quest-detail__status--action"
                                onClick={() => setAdventurersOpen(true)}
                            >
                                {STATUS_LABEL[quest.status]}
                            </button>
                        ) : (
                            <span className="quest-detail__status">{STATUS_LABEL[quest.status]}</span>
                        )}
                    </div>

                    <div className="quest-detail__footer">
                        <button
                            type="button"
                            className="btn"
                            onClick={() => navigate(`/quests/${quest.id}/edit`)}
                        >
                            Modify
                        </button>
                        <button
                            type="button"
                            className="btn btn--icon btn--danger"
                            onClick={handleDelete}
                            disabled={deleting}
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
                    </div>

                    {adventurersOpen && (
                        <AdventurersModal
                            questId={quest.id}
                            requiredLevel={quest.requiredLevel}
                            onAssigned={handleAssigned}
                            onClose={closeAdventurers}
                        />
                    )}
                </>
            )}
        </main>
    );
}