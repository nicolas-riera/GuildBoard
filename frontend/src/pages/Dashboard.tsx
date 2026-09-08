import { useEffect, useState } from "react";
import { fetchApi } from "../services/api";

type Quest = {
    id: number;
    title: string;
    status?: string;
    difficulty?: string;
};

export default function Dashboard() {
    const [quests, setQuests] = useState<Quest[]>([]);

    useEffect(() => {
        fetchApi<Quest[]>("/quests")
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
