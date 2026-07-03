export const USER_SELECT = {
    select: { id: true, name: true, email: true, phone: true },
} as const;

export const TEAM_WITH_OWNER = {
    include: { user: USER_SELECT },
} as const;

export const CAPTAIN_WITH_USER = {
    include: { user: USER_SELECT },
} as const;