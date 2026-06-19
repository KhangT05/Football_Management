// seasonTeam.type.ts
// Dùng nội bộ trong service (không expose qua TSOA route return type)
export const withRelations = {
    include: {
        season: { select: { id: true, name: true } },
        team: { select: { id: true, name: true, logo: true } },
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
    },
};
//# sourceMappingURL=seasonTeam.type.js.map