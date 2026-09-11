import { useState, type FormEvent } from "react";

import { CharacterClass } from "./enums";
import { CLASS_LABEL } from "./Record";
import { xpToNextLevel } from "./xp";
import { toInt } from "../utils/number";

import "../styles/form.css";

export interface AdventurerFormValues {
    name: string;
    characterClass: CharacterClass;
    level: number;
    xp: number;
    gold: number;
}

interface AdventurerFormProps {
    heading: string;
    initialValues: AdventurerFormValues;
    submitLabel: string;
    pendingLabel: string;
    canEditProgress?: boolean;
    onSubmit: (values: AdventurerFormValues) => Promise<void>;
    onCancel: () => void;
}

export default function AdventurerForm({
    heading,
    initialValues,
    submitLabel,
    pendingLabel,
    canEditProgress = false,
    onSubmit,
    onCancel,
}: AdventurerFormProps) {
    const [name, setName] = useState(initialValues.name);
    const [characterClass, setCharacterClass] = useState<CharacterClass>(
        initialValues.characterClass
    );
    const [level, setLevel] = useState(String(initialValues.level));
    const [xp, setXp] = useState(String(initialValues.xp));
    const [gold, setGold] = useState(String(initialValues.gold));

    const [error, setError] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    function validate(): string | null {
        const trimmedName = name.trim();
        if (trimmedName.length < 2 || trimmedName.length > 50) {
            return "The name must be between 2 and 50 characters.";
        }

        if (!canEditProgress) return null;

        if (!Number.isInteger(toInt(level)) || toInt(level) < 1) {
            return "The level must be a whole number of 1 or more.";
        }
        if (!Number.isInteger(toInt(xp)) || toInt(xp) < 0) {
            return "The xp must be a whole number of 0 or more.";
        }
        if (!Number.isInteger(toInt(gold)) || toInt(gold) < 0) {
            return "The gold must be a whole number of 0 or more.";
        }

        const needed = xpToNextLevel(toInt(level));
        if (toInt(xp) >= needed) {
            return `With ${needed} xp or more the adventurer would reach the next level, keep the xp below.`;
        }

        return null;
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
                name: name.trim(),
                characterClass,
                level: canEditProgress ? toInt(level) : initialValues.level,
                xp: canEditProgress ? toInt(xp) : initialValues.xp,
                gold: canEditProgress ? toInt(gold) : initialValues.gold,
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
                <label htmlFor="adventurer-name">Name</label>
                <input
                    id="adventurer-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <span className="form__hint">From 2 to 50 characters</span>
            </div>

            <div className="form__field">
                <label htmlFor="adventurer-class">Class</label>
                <select
                    id="adventurer-class"
                    value={characterClass}
                    onChange={(e) => setCharacterClass(e.target.value as CharacterClass)}
                >
                    {Object.values(CharacterClass).map((value) => (
                        <option key={value} value={value}>
                            {CLASS_LABEL[value]}
                        </option>
                    ))}
                </select>
            </div>

            {canEditProgress ? (
                <div className="form__row">
                    <div className="form__field">
                        <label htmlFor="adventurer-level">Level</label>
                        <input
                            id="adventurer-level"
                            type="number"
                            min={1}
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        />
                    </div>

                    <div className="form__field">
                        <label htmlFor="adventurer-xp">Xp</label>
                        <input
                            id="adventurer-xp"
                            type="number"
                            min={0}
                            value={xp}
                            onChange={(e) => setXp(e.target.value)}
                        />
                        <span className="form__hint">
                            Below {xpToNextLevel(toInt(level) || 1)} xp for this level
                        </span>
                    </div>

                    <div className="form__field">
                        <label htmlFor="adventurer-gold">Gold</label>
                        <input
                            id="adventurer-gold"
                            type="number"
                            min={0}
                            value={gold}
                            onChange={(e) => setGold(e.target.value)}
                        />
                    </div>
                </div>
            ) : (
                <p className="form__hint">
                    A new adventurer starts at level 1 with no xp and no gold.
                </p>
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
