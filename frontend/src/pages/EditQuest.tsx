import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import QuestForm from "../components/QuestForm";
import type { QuestFormValues } from "../components/QuestForm";
import { QuestStatus } from "../components/enums";
import { getQuestById, updateQuest } from "../services/QuestServices";
import type { QuestResponse } from "../types/quest";
import { questDetailsPath } from "../routes";

export default function EditQuest() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const questId = Number(id);

    const [quest, setQuest] = useState<QuestResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (Number.isNaN(questId)) return;

        let cancelled = false;

        getQuestById(questId)
            .then((loaded) => {
                if (!cancelled) setQuest(loaded);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message);
            });

        return () => {
            cancelled = true;
        };
    }, [questId]);

    async function handleSubmit(values: QuestFormValues) {
        await updateQuest(questId, values);
        navigate(questDetailsPath(questId));
    }

    if (Number.isNaN(questId)) {
        return <p className="empty-row">Invalid quest ID.</p>;
    }

    if (error !== null) {
        return <p className="empty-row">{error}</p>;
    }

    if (quest === null) {
        return <p className="empty-row">Loading the quest...</p>;
    }

    // the API only lets an available quest be edited
    if (quest.status !== QuestStatus.AVAILABLE) {
        return (
            <main className="quest-form">
                <h2 className="quest-form__title">Edit the quest</h2>
                <p className="empty-row">Only an available quest can be edited.</p>
                <div className="quest-form__actions">
                    <Link to={questDetailsPath(quest.id)} className="btn btn--action">
                        Back to the quest
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <QuestForm
            heading="Edit the quest"
            initialValues={{
                title: quest.title,
                description: quest.description,
                difficulty: quest.difficulty,
                requiredLevel: quest.requiredLevel,
                goldReward: quest.goldReward,
                xpReward: quest.xpReward,
            }}
            submitLabel="Save"
            pendingLabel="Saving..."
            onSubmit={handleSubmit}
            onCancel={() => navigate(questDetailsPath(quest.id))}
        />
    );
}
