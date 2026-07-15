import { MatchEventType, JerseyType, LineupType } from "../generated/prisma/client.js";
import { randInt, pickOrThrow } from "./helperSeeder.js";
import type { DbClient } from "./dbTypes.js";

interface TeamPlayerLite {
    player_id: number;
    jersey_number: number;
    position: string;
    role: string;
}

async function getSquadOrdered(db: DbClient, teamId: number): Promise<TeamPlayerLite[]> {
    const rows = await db.teamPlayer.findMany({
        where: { team_id: teamId },
        orderBy: { jersey_number: "asc" },
        select: { player_id: true, jersey_number: true, position: true, role: true },
    });
    return rows;
}

function splitStartersSubs(squad: TeamPlayerLite[]): { starters: TeamPlayerLite[]; subs: TeamPlayerLite[] } {
    const gk = squad.filter((p) => p.jersey_number <= 3).slice(0, 1);
    const df = squad.filter((p) => p.jersey_number >= 4 && p.jersey_number <= 11).slice(0, 4);
    const mf = squad.filter((p) => p.jersey_number >= 12 && p.jersey_number <= 19).slice(0, 4);
    const fw = squad.filter((p) => p.jersey_number >= 20).slice(0, 2);

    const starters = [...gk, ...df, ...mf, ...fw];
    const starterIds = new Set(starters.map((p) => p.player_id));
    const subs = squad.filter((p) => !starterIds.has(p.player_id));
    return { starters, subs };
}

async function seedLineupForTeam(
    db: DbClient,
    matchId: number,
    teamId: number,
    starters: TeamPlayerLite[],
    subs: TeamPlayerLite[]
) {
    for (const p of starters) {
        await db.matchLineup.upsert({
            where: { match_id_player_id: { match_id: matchId, player_id: p.player_id } },
            update: {},
            create: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                position: p.position as any,
                lineup_type: LineupType.starter,
                is_captain: p.role === "captain",
            },
        });
    }
    for (const p of subs.slice(0, 5)) {
        await db.matchLineup.upsert({
            where: { match_id_player_id: { match_id: matchId, player_id: p.player_id } },
            update: {},
            create: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                position: p.position as any,
                lineup_type: LineupType.substitute,
            },
        });
    }
}

async function seedJerseyForTeam(
    db: DbClient,
    matchId: number,
    teamId: number,
    seasonTeamId: number,
    type: JerseyType
) {
    const jersey = await db.seasonTeamJersey.findUnique({
        where: { season_team_id_type: { season_team_id: seasonTeamId, type } },
    });
    if (!jersey) return;

    await db.matchJerseyAssignment.upsert({
        where: { match_id_team_id: { match_id: matchId, team_id: teamId } },
        update: {},
        create: { match_id: matchId, team_id: teamId, season_jersey_id: jersey.id },
    });
}

async function seedGoalEvents(
    db: DbClient,
    matchId: number,
    teamId: number,
    starters: TeamPlayerLite[],
    goals: number
) {
    const scorers = starters.filter((p) => p.position === "forward" || p.position === "midfielder");
    const pool = scorers.length ? scorers : starters;
    if (pool.length === 0) return;

    for (let i = 0; i < goals; i++) {
        const scorer = pickOrThrow(pool, `seedGoalEvents team=${teamId}`);
        await db.matchEvent.create({
            data: { match_id: matchId, team_id: teamId, player_id: scorer.player_id, type: MatchEventType.goal, minute: randInt(1, 90) },
        });
    }
}

async function seedCardEvents(db: DbClient, matchId: number, teamId: number, starters: TeamPlayerLite[]) {
    const yellowCount = randInt(0, 3);
    for (let i = 0; i < yellowCount; i++) {
        const p = pickOrThrow(starters, `seedCardEvents yellow team=${teamId}`);
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                type: MatchEventType.yellow_card,
                card_color: "yellow",
                minute: randInt(1, 90),
            },
        });
    }
    if (Math.random() < 0.06) {
        const p = pickOrThrow(starters, `seedCardEvents red team=${teamId}`);
        await db.matchEvent.create({
            data: {
                match_id: matchId,
                team_id: teamId,
                player_id: p.player_id,
                type: MatchEventType.red_card,
                card_color: "red",
                minute: randInt(1, 90),
            },
        });
    }
}

export async function seedMatchDetails(
    db: DbClient,
    params: {
        matchId: number;
        homeTeamId: number;
        awayTeamId: number;
        homeScore: number;
        awayScore: number;
        homeSeasonTeamId: number;
        awaySeasonTeamId: number;
    }
) {
    const { matchId, homeTeamId, awayTeamId, homeScore, awayScore, homeSeasonTeamId, awaySeasonTeamId } = params;

    const existingLineupCount = await db.matchLineup.count({ where: { match_id: matchId } });
    if (existingLineupCount > 0) {
        console.log(`[MatchDetailSeeder] match #${matchId} đã có ${existingLineupCount} lineup — bỏ qua (idempotent).`);
        return;
    }

    const homeSquad = await getSquadOrdered(db, homeTeamId);
    const awaySquad = await getSquadOrdered(db, awayTeamId);
    if (homeSquad.length < 11 || awaySquad.length < 11) {
        console.warn(
            `[MatchDetailSeeder] bỏ qua match #${matchId}: squad chưa đủ 11 ` +
            `(home team #${homeTeamId}=${homeSquad.length}, away team #${awayTeamId}=${awaySquad.length}). ` +
            `Kiểm tra lại thứ tự seed — squadSeeder phải chạy xong trước bước này.`
        );
        return;
    }

    const homeSplit = splitStartersSubs(homeSquad);
    const awaySplit = splitStartersSubs(awaySquad);

    await seedLineupForTeam(db, matchId, homeTeamId, homeSplit.starters, homeSplit.subs);
    await seedLineupForTeam(db, matchId, awayTeamId, awaySplit.starters, awaySplit.subs);

    await seedJerseyForTeam(db, matchId, homeTeamId, homeSeasonTeamId, JerseyType.home);
    await seedJerseyForTeam(db, matchId, awayTeamId, awaySeasonTeamId, JerseyType.away);

    await seedGoalEvents(db, matchId, homeTeamId, homeSplit.starters, homeScore);
    await seedGoalEvents(db, matchId, awayTeamId, awaySplit.starters, awayScore);

    await seedCardEvents(db, matchId, homeTeamId, homeSplit.starters);
    await seedCardEvents(db, matchId, awayTeamId, awaySplit.starters);
}