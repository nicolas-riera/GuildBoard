import { useEffect, useState } from "react";
import { getQuests } from "../services/QuestServices";

type Quest = {
    id: number;
    title: string;
    status?: string;
    difficulty?: string;
};

export default function Dashboard() {
    const [quests, setQuests] = useState<Quest[]>([]);

    useEffect(() => {
        getQuests()
            .then(setQuests)
            .catch((err) => console.error(err));
    }, []);

    return (

        <ul>
            {quests.map((quest) => (
                <p key={quest.id}>{JSON.stringify(quest)}</p>
            ))}
        </ul>
    );
}
