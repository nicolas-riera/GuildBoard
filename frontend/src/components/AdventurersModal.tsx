import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";

import { getAdventurers } from "../services/adventurerServices";
import type { AdventurerResponse } from "../types/adventurer";
import { CLASS_LABEL } from "./Record";

interface AdventurersModalProps {
    requiredLevel: number;
    onClose: () => void;
}

export default function AdventurersModal({ requiredLevel, onClose }: AdventurersModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [adventurers, setAdventurers] = useState<AdventurerResponse[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (!dialog.open) dialog.showModal();
        dialog.addEventListener("close", onClose);

        return () => {
            dialog.removeEventListener("close", onClose);
        };
    }, [onClose]);

    useEffect(() => {
        let cancelled = false;

        getAdventurers()
            .then((data) => {
                if (!cancelled) setAdventurers(data);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const loading = adventurers === null && error === null;
    const eligible = (adventurers ?? []).filter(
        (adventurer) => adventurer.level >= requiredLevel
    );

    function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        if (event.target === dialogRef.current) dialogRef.current?.close();
    }

    return (
        <dialog
            ref={dialogRef}
            className="modal"
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

            <p className="modal__subtitle">Level {requiredLevel} and above</p>

            <div className="modal__body">
                {loading && <p className="empty-row">Loading the adventurers...</p>}

                {error && <p className="empty-row">{error}</p>}

                {!loading && !error && eligible.length === 0 && (
                    <p className="empty-row">
                        No adventurer has reached level {requiredLevel}.
                    </p>
                )}

                {!loading && !error && eligible.length > 0 && (
                    <ul className="adventurer-list">
                        {eligible.map((adventurer) => (
                            <li key={adventurer.id} className="adventurer">
                                <span className="adventurer__name">{adventurer.name}</span>
                                <span className="adventurer__class">
                                    {CLASS_LABEL[adventurer.characterClass]}
                                </span>
                                <span className="adventurer__level">LVL {adventurer.level}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </dialog>
    );
}
