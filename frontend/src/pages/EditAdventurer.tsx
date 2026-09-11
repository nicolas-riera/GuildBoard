import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AdventurerForm, { type AdventurerFormValues } from "../components/AdventurerForm";
import { adventurerDetailsPath } from "../routes";
import { getAdventurerById, updateAdventurer } from "../services/adventurerServices";
import type { AdventurerResponse } from "../types/adventurer";

export default function EditAdventurer() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const adventurerId = Number(id);

    const [adventurer, setAdventurer] = useState<AdventurerResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (Number.isNaN(adventurerId)) return;

        let cancelled = false;

        getAdventurerById(adventurerId)
            .then((loaded) => {
                if (!cancelled) setAdventurer(loaded);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, [adventurerId]);

    async function handleSubmit(values: AdventurerFormValues) {
        await updateAdventurer(adventurerId, values);
        navigate(adventurerDetailsPath(adventurerId));
    }

    if (Number.isNaN(adventurerId)) {
        return <p className="empty-row">Invalid adventurer ID.</p>;
    }

    if (error !== null) {
        return <p className="empty-row">{error}</p>;
    }

    if (adventurer === null) {
        return <p className="empty-row">Loading the adventurer...</p>;
    }

    return (
        <AdventurerForm
            heading="Edit the adventurer"
            initialValues={{
                name: adventurer.name,
                characterClass: adventurer.characterClass,
                level: adventurer.level,
                xp: adventurer.xp,
                gold: adventurer.gold,
            }}
            submitLabel="Save"
            pendingLabel="Saving..."
            canEditProgress
            onSubmit={handleSubmit}
            onCancel={() => navigate(adventurerDetailsPath(adventurer.id))}
        />
    );
}
