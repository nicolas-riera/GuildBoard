import { useEffect, useState } from "react";

import { formatDateTime } from "./format";
import Modal from "./Modal";
import { findQuestAssignment, type QuestAssignment } from "../services/adventurerServices";
import { completeQuest } from "../services/QuestServices";

interface CompleteQuestModalProps {
    questId: number;
    onCompleted: () => void;
    onClose: () => void;
}

export default function CompleteQuestModal({
    questId,
    onCompleted,
    onClose,
}: CompleteQuestModalProps) {
    const [active, setActive] = useState<QuestAssignment | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        findQuestAssignment(questId)
            .then((found) => {
                if (cancelled) return;
                setActive(found !== null && found.assignment.completedAt === null ? found : null);
                setLoaded(true);
            })
            .catch((err: Error) => {
                if (cancelled) return;
                setError(err.message);
                setLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, [questId]);

    async function handleConfirm() {
        if (completing) return;

        setCompleting(true);
        setError(null);
        try {
            await completeQuest(questId);
            onCompleted();
        } catch (err) {
            setError((err as Error).message);
            setCompleting(false);
        }
    }

    return (
        <Modal title="Complete the quest" onClose={onClose}>
            <div className="modal__body">
                {!loaded && <p className="empty-row">Loading the assignment...</p>}

                {loaded && error && <p className="modal__error">{error}</p>}

                {loaded && (
                    <>
                        {active !== null ? (
                            <p className="modal__message">
                                <strong>{active.adventurer.name}</strong> has been on this quest
                                since {formatDateTime(active.assignment.assignedAt)}.
                            </p>
                        ) : (
                            <p className="modal__message">
                                No open assignment was found for this quest.
                            </p>
                        )}

                        <p className="modal__message modal__message--ask">
                            Do you really want to complete it?
                        </p>

                        <div className="modal__actions">
                            <button
                                type="button"
                                className="btn"
                                onClick={handleConfirm}
                                disabled={completing}
                            >
                                {completing ? "Completing..." : "Yes"}
                            </button>
                            <button
                                type="button"
                                className="btn"
                                onClick={onClose}
                                disabled={completing}
                            >
                                No
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
