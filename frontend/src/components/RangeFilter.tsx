export type RangeMode = "MIN" | "MAX";

interface RangeFilterProps {
    id: string;
    label: string;
    mode: RangeMode;
    value: number;
    floor: number;
    onModeChange: (mode: RangeMode) => void;
    onValueChange: (value: number) => void;
}

export default function RangeFilter({
    id,
    label,
    mode,
    value,
    floor,
    onModeChange,
    onValueChange,
}: RangeFilterProps) {
    return (
        <div className="filter">
            <label htmlFor={`${id}-filter`}>{label}</label>
            <select
                id={`${id}-mode`}
                aria-label={`${label} comparison`}
                value={mode}
                onChange={(e) => onModeChange(e.target.value as RangeMode)}
            >
                <option value="MIN">At least</option>
                <option value="MAX">At most</option>
            </select>
            <input
                id={`${id}-filter`}
                type="number"
                min={floor}
                value={value}
                onChange={(e) => onValueChange(Math.max(floor, Number(e.target.value) || floor))}
            />
        </div>
    );
}
