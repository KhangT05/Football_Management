// ─── Projection cho Queryable<Match> ─────────────────────────────────────────
// Derive type trực tiếp từ Prisma schema qua MatchGetPayload thay vì khai tay
// 1 interface song song với `select` — tránh drift khi schema đổi field/nullability.
// KHÔNG dùng type này làm response DTO cho tsoa: Prisma payload type là generic
// mapped type, tsoa khó introspect đúng (giống lý do SeasonTeamWithRelations phải
// khai tay thay vì dùng Prisma.SeasonTeamGetPayload trực tiếp). ScheduleMatchItem
// (flat, ở trên) mới là DTO băng qua controller boundary.
export const matchScheduleSelect = {
    id: true,
    round: true,
    home_team_id: true,
    away_team_id: true,
    scheduled_at: true,
    venue_id: true,
    status: true,
};
//# sourceMappingURL=schedule.type.js.map