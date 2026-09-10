export const ROUTES = {
    dashboard: "/",
    adventurers: "/adventurers",
    newQuest: "/quests/new",
    questDetails: "/quests/:id",
    editQuest: "/quests/:id/edit",
} as const;

export function questDetailsPath(id: number | string): string {
    return `/quests/${id}`;
}

export function questEditPath(id: number | string): string {
    return `/quests/${id}/edit`;
}
