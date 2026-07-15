// prisma/seed/seasonSeeder.ts
import { Prisma, JerseyType, SeasonStatus, PitchType } from "../generated/prisma/client.js";
export async function seedVenues(db, venues) {
    if (venues.length === 0) {
        throw new Error("seedVenues: venues rỗng — kiểm tra lại teamGenerator.generateVenues()");
    }
    const ids = [];
    for (const v of venues) {
        const venue = await db.venue.upsert({
            where: { name: v.name },
            update: {},
            create: { name: v.name, address: v.address },
        });
        ids.push(venue.id);
    }
    console.log(`[SeasonSeeder] seeded ${ids.length} venues`);
    return ids;
}
/**
 * FIX (multi-season): bản gốc hardcode tên "World Cup Season", status luôn
 * "ongoing", is_registration_open luôn false, và LUÔN đăng ký toàn bộ đội
 * ngay lập tức — chỉ mô phỏng được đúng 1 kiểu mùa giải "đang đá dở, mọi đội
 * đã duyệt". Giờ nhận SeasonConfig tường minh để mô phỏng đủ 5 giá trị của
 * SeasonStatus (upcoming/registration_open/ongoing/finished/cancelled) và
 * tách rời bước "tạo Season" khỏi bước "đăng ký đội" (registerAllTeams).
 */
export async function seedSeasonConfigurable(db, config, teamIdByName, venues) {
    const season = await db.season.upsert({
        where: { name: config.name },
        update: {},
        create: {
            name: config.name,
            description: config.description ?? null,
            tournament_id: config.tournamentId,
            tournament_rule_id: config.tournamentRuleId,
            user_id: config.organizerUserId,
            max_teams: config.maxTeams,
            group_count: config.groupCount,
            status: config.status,
            is_registration_open: config.isRegistrationOpen,
            registration_deadline: config.registrationDeadline ?? null,
            start_date: config.startDate ?? null,
            end_date: config.endDate ?? null,
            registration_fee: new Prisma.Decimal(config.registrationFee ?? 5_000_000),
            cancel_reason: config.cancelReason ?? null,
            pitch_type: config.pitchType ?? PitchType.san_11,
            is_active: config.status !== SeasonStatus.cancelled,
        },
    });
    const seasonTeamIdByTeamId = {};
    const venueIds = await seedVenues(db, venues);
    if (config.registerAllTeams ?? true) {
        for (const teamId of Object.values(teamIdByName)) {
            const st = await db.seasonTeam.upsert({
                where: { season_id_team_id: { season_id: season.id, team_id: teamId } },
                update: {},
                create: { season_id: season.id, team_id: teamId, status: "active" },
            });
            seasonTeamIdByTeamId[teamId] = st.id;
            await db.seasonTeamJersey.upsert({
                where: { season_team_id_type: { season_team_id: st.id, type: JerseyType.home } },
                update: {},
                create: {
                    season_team_id: st.id,
                    type: JerseyType.home,
                    primary_color: "#FFFFFF",
                    secondary_color: "#111111",
                },
            });
            await db.seasonTeamJersey.upsert({
                where: { season_team_id_type: { season_team_id: st.id, type: JerseyType.away } },
                update: {},
                create: {
                    season_team_id: st.id,
                    type: JerseyType.away,
                    primary_color: "#111111",
                    secondary_color: "#FFFFFF",
                },
            });
        }
    }
    console.log(`[SeasonSeeder] Season #${season.id} (${config.name}, status=${config.status}) với ${Object.keys(seasonTeamIdByTeamId).length} SeasonTeam`);
    return { seasonId: season.id, venueIds, seasonTeamIdByTeamId };
}
/**
 * Giữ nguyên chữ ký/hành vi cũ (tương thích ngược) cho bất kỳ code nào còn
 * gọi seedSeason() trực tiếp — tương đương seedSeasonConfigurable với
 * status=ongoing, registerAllTeams=true, tên "World Cup Season".
 */
export async function seedSeason(db, tournamentId, tournamentRuleId, organizerUserId, teamIdByName, venues) {
    return seedSeasonConfigurable(db, {
        name: "World Cup Season",
        tournamentId,
        tournamentRuleId,
        organizerUserId,
        maxTeams: 32,
        groupCount: 8,
        status: SeasonStatus.ongoing,
        isRegistrationOpen: false,
        registerAllTeams: true,
    }, teamIdByName, venues);
}
//# sourceMappingURL=seasonSeeder.js.map