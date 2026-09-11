import { useNavigate } from "react-router-dom";

import AdventurerForm from "../components/AdventurerForm";
import type { AdventurerFormValues } from "../components/AdventurerForm";
import { CharacterClass } from "../components/enums";
import { createAdventurer } from "../services/adventurerServices";
import { ROUTES, adventurerDetailsPath } from "../routes";

const EMPTY_ADVENTURER: AdventurerFormValues = {
    name: "",
    characterClass: CharacterClass.WARRIOR,
    level: 1,
    xp: 0,
    gold: 0,
};

export default function AddAdventurer() {
    const navigate = useNavigate();

    async function handleSubmit(values: AdventurerFormValues) {
        const created = await createAdventurer({
            name: values.name,
            characterClass: values.characterClass,
        });
        navigate(adventurerDetailsPath(created.id));
    }

    return (
        <AdventurerForm
            heading="Recruit an adventurer"
            initialValues={EMPTY_ADVENTURER}
            submitLabel="Recruit"
            pendingLabel="Recruiting..."
            onSubmit={handleSubmit}
            onCancel={() => navigate(ROUTES.adventurers)}
        />
    );
}
