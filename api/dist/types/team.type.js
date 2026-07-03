export const USER_SELECT = {
    select: { id: true, name: true, email: true, phone: true },
};
export const TEAM_WITH_OWNER = {
    include: { user: USER_SELECT },
};
export const CAPTAIN_WITH_USER = {
    include: { user: USER_SELECT },
};
//# sourceMappingURL=team.type.js.map