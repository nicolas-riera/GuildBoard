export const ROUTES = {
    dashboard: "/",
    questDetails: "/quests/:id",
} as const;

export function questDetailsPath(id: number | string): string {
    return `/quests/${id}`;
}
