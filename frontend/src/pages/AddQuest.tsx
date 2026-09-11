import { useNavigate } from "react-router-dom";

import { Difficulty } from "../components/enums";
import QuestForm, { type QuestFormValues } from "../components/QuestForm";
import { ROUTES, questDetailsPath } from "../routes";
import { createQuest } from "../services/QuestServices";

const EMPTY_QUEST: QuestFormValues = {
    title: "",
    description: "",
    difficulty: Difficulty.EASY,
    requiredLevel: 1,
    goldReward: 0,
    xpReward: 0,
};

export default function AddQuest() {
    const navigate = useNavigate();

    async function handleSubmit(values: QuestFormValues) {
        const created = await createQuest(values);
        navigate(questDetailsPath(created.id));
    }

    return (
        <QuestForm
            heading="Add a quest"
            initialValues={EMPTY_QUEST}
            submitLabel="Create"
            pendingLabel="Creating..."
            canSuggestRewards
            onSubmit={handleSubmit}
            onCancel={() => navigate(ROUTES.dashboard)}
        />
    );
}
