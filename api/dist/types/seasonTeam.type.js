// seasonTeam.type.ts
// Dùng nội bộ trong service (không expose qua TSOA route return type)
export const withRelations = {
    include: {
        // FIX: season trước đây chỉ select { id, name } — FE (ManageSeasonTeams)
        // cần season.tournament để hiển thị cột Tournament khi list gộp nhiều
        // season cùng lúc (branch không filter season_id trong findAll()).
        // Thiếu field này khiến FE luôn fallback về placeholder "chưa rõ mùa"
        // bất kể request có filter hay không, vì đây là include DUY NHẤT
        // được dùng bởi cả findAll/findByIdOrFail/approve/... — không có
        // select riêng nào khác cho case list-all.
        season: {
            select: {
                id: true,
                name: true,
                status: true,
                tournament: { select: { id: true, name: true, logo: true } },
            },
        },
        team: { select: { id: true, name: true, logo: true } },
        user: { select: { id: true, name: true, email: true } },
        group: { select: { id: true, name: true } },
    },
};
//# sourceMappingURL=seasonTeam.type.js.map