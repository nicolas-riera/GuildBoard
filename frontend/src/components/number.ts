export function toInt(value: string): number {
    const trimmed = value.trim();
    return trimmed === "" ? Number.NaN : Number(trimmed);
}
