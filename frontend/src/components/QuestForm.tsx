import { useState, type FormEvent } from "react";

import { Difficulty } from "./enums";
import { DIFFICULTY_LABEL, DIFFICULTY_REWARD_RATIO } from "./Record";
import { toInt } from "./number";

import "../styles/form.css";

export interface QuestFormValues {
    title: string;
    description: string;
    difficulty: Difficulty;
    requiredLevel: number;
    goldReward: number;
    xpReward: number;
}

interface QuestFormProps {
    heading: string;
    initialValues: QuestFormValues;
    submitLabel: string;
    pendingLabel: string;
    canSuggestRewards?: boolean;
    onSubmit: (values: QuestFormValues) => Promise<void>;
    onCancel: () => void;
}

export default function QuestForm({
    heading,
    initialValues,
    submitLabel,
    pendingLabel,
    canSuggestRewards = false,
    onSubmit,
    onCancel,
}: QuestFormProps) {
    const [title, setTitle] = useState(initialValues.title);
    const [description, setDescription] = useState(initialValues.description);
    const [difficulty, setDifficulty] = useState<Difficulty>(initialValues.difficulty);
    const [requiredLevel, setRequiredLevel] = useState(String(initialValues.requiredLevel));
    const [goldReward, setGoldReward] = useState(String(initialValues.goldReward));
    const [xpReward, setXpReward] = useState(String(initialValues.xpReward));

    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    function validate(): string | null {
        const trimmedTitle = title.trim();
        if (trimmedTitle.length < 5 || trimmedTitle.length > 100) {
            return "The title must be between 5 and 100 characters.";
        }

        const trimmedDescription = description.trim();
        if (trimmedDescription.length < 10 || trimmedDescription.length > 500) {
            return "The description must be between 10 and 500 characters.";
        }

        if (!Number.isInteger(toInt(requiredLevel)) || toInt(requiredLevel) < 1) {
            return "The required level must be a whole number of 1 or more.";
        }
        if (!Number.isInteger(toInt(goldReward)) || toInt(goldReward) < 0) {
            return "The gold reward must be a whole number of 0 or more.";
        }
        if (!Number.isInteger(toInt(xpReward)) || toInt(xpReward) < 0) {
            return "The xp reward must be a whole number of 0 or more.";
        }

        return null;
    }

    function suggestRewards() {
        const level = toInt(requiredLevel);
        if (!Number.isInteger(level) || level < 1) {
            setError("Set a required level of 1 or more first.");
            return;
        }

        const ratio = DIFFICULTY_REWARD_RATIO[difficulty];
        const xp = Math.round(level * 100 * ratio * (1 + (Math.random() * 0.3 - 0.15)));

        setError(null);
        setXpReward(String(xp));
        setGoldReward(String(Math.round(xp * 0.5)));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (pending) return;

        const invalid = validate();
        if (invalid !== null) {
            setError(invalid);
            return;
        }

        setError(null);
        setPending(true);
        try {
            await onSubmit({
                title: title.trim(),
                description: description.trim(),
                difficulty,
                requiredLevel: toInt(requiredLevel),
                goldReward: toInt(goldReward),
                xpReward: toInt(xpReward),
            });
        } catch (err) {
            setError((err as Error).message);
            setPending(false);
        }
    }

    return (
        <form className="form" onSubmit={handleSubmit} noValidate>
            <h2 className="form__title">{heading}</h2>

            {error && <p className="form__error">{error}</p>}

            <div className="form__field">
                <label htmlFor="quest-title">Title</label>
                <input
                    id="quest-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <span className="form__hint">From 5 to 100 characters</span>
            </div>

            <div className="form__field">
                <label htmlFor="quest-description">Description</label>
                <textarea
                    id="quest-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <span className="form__hint">From 10 to 500 characters</span>
            </div>

            <div className="form__field">
                <label htmlFor="quest-difficulty">Difficulty</label>
                <select
                    id="quest-difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                    {Object.values(Difficulty).map((value) => (
                        <option key={value} value={value}>
                            {DIFFICULTY_LABEL[value]}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form__row">
                <div className="form__field">
                    <label htmlFor="quest-level">Required level</label>
                    <input
                        id="quest-level"
                        type="number"
                        min={1}
                        value={requiredLevel}
                        onChange={(e) => setRequiredLevel(e.target.value)}
                    />
                </div>

                <div className="form__field">
                    <label htmlFor="quest-gold">Gold reward</label>
                    <input
                        id="quest-gold"
                        type="number"
                        min={0}
                        value={goldReward}
                        onChange={(e) => setGoldReward(e.target.value)}
                    />
                </div>

                <div className="form__field">
                    <label htmlFor="quest-xp">Xp reward</label>
                    <input
                        id="quest-xp"
                        type="number"
                        min={0}
                        value={xpReward}
                        onChange={(e) => setXpReward(e.target.value)}
                    />
                </div>
            </div>

            {canSuggestRewards && (
                <div className="form__suggest">
                    <button
                        type="button"
                        className="btn"
                        onClick={suggestRewards}
                        disabled={pending}
                    >
                        Suggest rewards
                    </button>
                    <span className="form__hint">
                        Rolls gold and xp from the level and the difficulty
                    </span>
                </div>
            )}

            <div className="form__actions">
                <button type="submit" className="btn btn--action" disabled={pending}>
                    {pending ? pendingLabel : submitLabel}
                </button>
                <button
                    type="button"
                    className="btn btn--action"
                    onClick={onCancel}
                    disabled={pending}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
