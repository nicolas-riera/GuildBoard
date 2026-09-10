const LOCALE = "en-GB";

export function formatDateTime(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString(LOCALE, {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function plural(value: number, unit: string): string {
    return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

export function formatDuration(from: string, to: string | null): string {
    const start = new Date(from).getTime();
    const end = to === null ? Date.now() : new Date(to).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return "";

    const minutes = Math.max(0, Math.floor((end - start) / 60000));
    if (minutes < 1) return "less than a minute";
    if (minutes < 60) return plural(minutes, "minute");

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return plural(hours, "hour");

    const days = Math.floor(hours / 24);
    return plural(days, "day");
}
