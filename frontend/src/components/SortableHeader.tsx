export type SortDirection = "asc" | "desc";

export interface Sort<K extends string> {
    key: K;
    direction: SortDirection;
}

interface SortableHeaderProps<K extends string> {
    label: string;
    sortKey: K;
    sort: Sort<K> | null;
    onSort: (key: K) => void;
}

export default function SortableHeader<K extends string>({
    label,
    sortKey,
    sort,
    onSort,
}: SortableHeaderProps<K>) {
    const direction = sort !== null && sort.key === sortKey ? sort.direction : null;

    return (
        <th aria-sort={direction === null ? "none" : direction === "asc" ? "ascending" : "descending"}>
            <button
                type="button"
                className="th-sort"
                onClick={() => onSort(sortKey)}
                title={`Sort by ${label.toLowerCase()}`}
            >
                {label}
                <span className="th-sort__arrow" aria-hidden="true">
                    {direction === null ? "⇅" : direction === "asc" ? "▲" : "▼"}
                </span>
            </button>
        </th>
    );
}
