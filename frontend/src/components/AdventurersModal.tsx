import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

import { getAdventurers, getAdventurerHistory } from "../services/adventurerServices";
import { assignQuest } from "../services/QuestServices";
import type { AdventurerResponse } from "../types/adventurer";
import { CLASS_LABEL } from "./Record";

interface Candidate {
    adventurer: AdventurerResponse;
    onGoingQuest: string | null;
}

interface AdventurersModalProps {
    questId: number;
    requiredLevel: number;
    onAssigned: () => void;
    onClose: () => void;
}

export default function AdventurersModal({
    questId,
    requiredLevel,
    onAssigned,
    onClose,
}: AdventurersModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [candidates, setCandidates] = useState<Candidate[] | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [assigningId, setAssigningId] = useState<number | null>(null);
    const [assignError, setAssignError] = useState<string | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (!dialog.open) {
            dialog.showModal();
            // showModal() lands on the first focusable child (the close button); hold the
            // dialog itself instead so nothing looks pre-selected
            dialog.focus();
        }
        dialog.addEventListener("close", onClose);

        return () => {
            dialog.removeEventListener("close", onClose);
        };
    }, [onClose]);

    useEffect(() => {
        let cancelled = false;

        async function loadCandidates(): Promise<Candidate[]> {
            const eligible = (await getAdventurers()).filter(
                (adventurer) => adventurer.level >= requiredLevel
            );

            // an assignment without a completedAt means the adventurer is still out on that quest
            const histories = await Promise.all(
                eligible.map((adventurer) => getAdventurerHistory(adventurer.id).catch(() => null))
            );

            return eligible.map((adventurer, index) => ({
                adventurer,
                onGoingQuest:
                    histories[index]?.find((assignment) => !assignment.completedAt)?.questTitle ??
                    null,
            }));
        }

        loadCandidates()
            .then((loaded) => {
                if (!cancelled) setCandidates(loaded);
            })
            .catch((err: Error) => {
                if (!cancelled) setLoadError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, [requiredLevel]);

    const loading = candidates === null && loadError === null;

    async function handleAssign(adventurerId: number) {
        if (assigningId !== null) return;

        setAssigningId(adventurerId);
        setAssignError(null);
        try {
            await assignQuest(questId, { adventurerId });
            onAssigned();
        } catch (err) {
            setAssignError((err as Error).message);
            setAssigningId(null);
        }
    }

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === dialogRef.current) dialogRef.current?.close();
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal"
            tabIndex={-1}
            aria-labelledby="adventurers-modal-title"
            onClick={handleBackdropClick}
        >
            <header className="modal__header">
                <h2 id="adventurers-modal-title" className="modal__title">
                    Adventurers
                </h2>
                <button
                    type="button"
                    className="modal__close"
                    onClick={() => dialogRef.current?.close()}
                    aria-label="Close"
                >
                    &times;
                </button>
            </header>

            <p className="modal__subtitle">
                Pick an adventurer of level {requiredLevel} or above
            </p>

            <div className="modal__body">
                {assignError && <p className="modal__error">{assignError}</p>}

                {loading && <p className="empty-row">Loading the adventurers...</p>}

                {loadError && <p className="empty-row">{loadError}</p>}

                {candidates !== null && candidates.length === 0 && (
                    <p className="empty-row">
                        No adventurer has reached level {requiredLevel}.
                    </p>
                )}

                {candidates !== null && candidates.length > 0 && (
                    <ul className="adventurer-list">
                        {candidates.map(({ adventurer, onGoingQuest }) => (
                            <li key={adventurer.id} className="adventurer-list__item">
                                <button
                                    type="button"
                                    className="adventurer"
                                    onClick={() => handleAssign(adventurer.id)}
                                    disabled={onGoingQuest !== null || assigningId !== null}
                                    title={
                                        onGoingQuest !== null
                                            ? `${adventurer.name} is already on "${onGoingQuest}".`
                                            : `Assign this quest to ${adventurer.name}`
                                    }
                                >
                                    <span className="adventurer__name">{adventurer.name}</span>
                                    <span className="adventurer__class">
                                        {CLASS_LABEL[adventurer.characterClass]}
                                    </span>
                                    <span className="adventurer__level">LVL {adventurer.level}</span>
                                    {assigningId === adventurer.id && (
                                        <span className="adventurer__state">Assigning...</span>
                                    )}
                                </button>

                                {onGoingQuest !== null && (
                                    <p className="adventurer__busy">
                                        Already on going : {onGoingQuest}
                                    </p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </dialog>
    );
}
